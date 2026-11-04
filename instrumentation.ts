export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { getBrowser } = await import('@/lib/export');
  // Warm Chrome at boot without delaying readiness; the first export retries a failed launch.
  getBrowser().catch((error: unknown) => {
    console.error(
      'Chrome warm-up failed:',
      error instanceof Error ? error.message : error
    );
  });
}
