import PortalLayout from '@/components/PortalLayout';

export default function CarrierLayout({ children }: { children: React.ReactNode }) {
  return <PortalLayout role="carrier">{children}</PortalLayout>;
}
