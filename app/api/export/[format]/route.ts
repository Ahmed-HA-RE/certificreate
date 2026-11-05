import { certificateFileName } from '@/lib/certificate';
import { exportRequestSchema } from '@/lib/certificate-schema';
import { renderCertificatePdf, renderCertificatePng } from '@/lib/export';
import type { ExportFormat, ExportRequest } from '@/types/certificate';

const EXPORTERS: Record<
  ExportFormat,
  { contentType: string; render: (data: ExportRequest) => Promise<Uint8Array> }
> = {
  png: { contentType: 'image/png', render: renderCertificatePng },
  pdf: { contentType: 'application/pdf', render: renderCertificatePdf },
};

function isExportFormat(format: string): format is ExportFormat {
  return Object.hasOwn(EXPORTERS, format);
}

// A valid certificate is well under 1 KB; anything larger is never worth reading.
const MAX_BODY_BYTES = 16 * 1024;

function invalidData() {
  return Response.json({ error: 'Invalid certificate data.' }, { status: 400 });
}

function tooLarge() {
  return Response.json(
    { error: 'Certificate data is too large.' },
    { status: 413 }
  );
}

/** The body as text, or `null` once it passes `limit` bytes (the rest is never read). */
async function readBodyText(request: Request, limit: number) {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export async function POST(
  request: Request,
  ctx: RouteContext<'/api/export/[format]'>
) {
  const { format } = await ctx.params;
  if (!isExportFormat(format)) {
    return Response.json({ error: 'Unknown export format.' }, { status: 404 });
  }

  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    return tooLarge();
  }
  const text = await readBodyText(request, MAX_BODY_BYTES);
  if (text === null) return tooLarge();

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return invalidData();
  }
  const parsed = exportRequestSchema.safeParse(body);
  if (!parsed.success) return invalidData();

  const exporter = EXPORTERS[format];
  try {
    const file = await exporter.render(parsed.data);
    // Copy into an ArrayBuffer-backed view, which is what Response accepts.
    return new Response(new Uint8Array(file), {
      headers: {
        'Content-Type': exporter.contentType,
        'Content-Disposition': `attachment; filename="${certificateFileName(parsed.data, format)}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    // Never log the certificate fields; the message is enough to debug Chrome.
    console.error(
      'Certificate export failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return Response.json({ error: 'Export failed. Try again.' }, { status: 500 });
  }
}
