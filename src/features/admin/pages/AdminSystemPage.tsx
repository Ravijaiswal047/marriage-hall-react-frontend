import type { FC } from 'react';
import { Server, ShieldCheck, Database, Radio, Cpu, Network } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const AdminSystemPage: FC = () => {
  const services = [
    { name: 'api-gateway', port: '8081', role: 'Spring Cloud Gateway (WebFlux CORS & JWT)', status: 'ACTIVE' },
    { name: 'auth-service', port: '9090', role: 'Authentication, Signup, JWT & Profile', status: 'ACTIVE' },
    { name: 'hall-service', port: '8087', role: 'Marketplace Catalog, Venues & Cities', status: 'ACTIVE' },
    { name: 'booking-service', port: '8082', role: 'Reservations, Availability & Payments', status: 'ACTIVE' },
    { name: 'review-service', port: '8086', role: 'Hall Ratings & Verified Reviews', status: 'ACTIVE' },
    { name: 'notification-service', port: '8085', role: 'RabbitMQ Booking Event Consumer', status: 'ACTIVE' },
    { name: 'discovery-server', port: '8761', role: 'Eureka Service Discovery', status: 'ACTIVE' },
    { name: 'config-server', port: '8888', role: 'Central Property Configuration', status: 'ACTIVE' },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDDDDD]">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold text-[#222222]">System & Microservices Architecture</h1>
        </div>
      </div>

      {/* OVERVIEW BANNER */}
      <div className="p-6 bg-white border border-[#DDDDDD] rounded-3xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <Network className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#222222]">Spring Boot Microservices Stack</h2>
              <Badge variant="success" size="sm">
                8 Microservices Registered
              </Badge>
            </div>
            <span className="text-xs text-[#717171]">
              Gateway Base URL: <strong className="text-[#222222]">http://localhost:8081</strong>
            </span>
          </div>
        </div>
      </div>

      {/* MICROSERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc) => (
          <div
            key={svc.name}
            className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#222222] text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-600" />
                {svc.name}
              </span>
              <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Port :{svc.port}
              </span>
            </div>

            <p className="text-xs text-[#717171]">{svc.role}</p>

            <div className="flex items-center justify-between pt-2 border-t border-[#DDDDDD] text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Eureka Registered
              </span>
              <Badge variant="success" size="sm" className="text-[10px]">
                {svc.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* DATABASE & INFRASTRUCTURE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col gap-2 text-xs">
          <span className="font-bold text-[#222222] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#FF385C]" /> MySQL Container Database
          </span>
          <span className="text-[#717171]">Host Port: 3307 (Mapped to Container 3306)</span>
          <span className="text-[#717171]">Databases: auth_db, hall_db, booking_db, review_db</span>
        </div>

        <div className="p-5 bg-white border border-[#DDDDDD] rounded-2xl shadow-2xs flex flex-col gap-2 text-xs">
          <span className="font-bold text-[#222222] flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-600" /> RabbitMQ Message Broker
          </span>
          <span className="text-[#717171]">Ports: 5672 (AMQP), 15672 (Management)</span>
          <span className="text-[#717171]">Queue: booking.queue (BookingCreatedEvent)</span>
        </div>
      </div>
    </div>
  );
};

