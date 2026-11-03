import { CornerOrnament } from '@/components/home/corner-ornament';
import { LogoMark } from '@/components/home/logo-mark';
import type { CertificateData } from '@/types/certificate';

interface CertificateProps {
  data: CertificateData;
}

export function Certificate({ data }: CertificateProps) {
  return (
    <div className='cert' data-border={data.border}>
      <div className='cert-paper'>
        <div className='cert-dash' />
        <div className='cert-rule' />
        <CornerOrnament position='tl' />
        <CornerOrnament position='tr' />
        <CornerOrnament position='bl' />
        <CornerOrnament position='br' />

        <p className='cert-headline'>CERTIFICATE</p>
        <p className='cert-subtitle'>OF COMPLETION</p>
        <p className='cert-presented'>THIS IS TO CERTIFY THAT</p>
        <p className='cert-name'>{data.recipientName}</p>
        <div className='cert-line name' />
        <p className='cert-completed'>HAS COMPLETED THE COURSE</p>
        <p className='cert-course'>{data.courseTitle}</p>

        <div className='cert-footer'>
          <div className='cert-sig'>
            <div className='cert-sig-value'>{data.date}</div>
            <div className='cert-line sig' />
            <div className='cert-sig-label'>Date</div>
          </div>
          <LogoMark />
          <div className='cert-sig'>
            <div className='cert-sig-value'>{data.instructorName}</div>
            <div className='cert-line sig' />
            <div className='cert-sig-label'>Instructor</div>
          </div>
        </div>
      </div>
    </div>
  );
}
