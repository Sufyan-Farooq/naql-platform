import PortalLayout from '@/components/PortalLayout';

export default function ShipperLayout({ children }: { children: React.ReactNode }) {
  return <PortalLayout role="shipper">{children}</PortalLayout>;
}
