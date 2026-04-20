declare module 'lucide-react' {
  import React = require('react');
  
  interface IconProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
  }
  
  type Icon = React.ComponentType<IconProps>;
  
  export const Calendar: Icon;
  export const Trophy: Icon;
  export const Map: Icon;
  export const Radio: Icon;
  export const UserCircle2: Icon;
  export const Users: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const LogOut: Icon;
  export const Cpu: Icon;
  export const Globe2: Icon;
  export const ChevronRight: Icon;
  export const ChevronLeft: Icon;
  export const ChevronDown: Icon;
  export const ChevronUp: Icon;
  export const ShieldCheck: Icon;
  export const User: Icon;
  export const Lock: Icon;
  export const Mail: Icon;
  export const AlertCircle: Icon;
  export const Loader2: Icon;
  export const ArrowLeft: Icon;
  export const MapPin: Icon;
  export const Route: Icon;
  export const Globe: Icon;
  export const ExternalLink: Icon;
  export const Search: Icon;
  export const Filter: Icon;
  export const Building2: Icon;
  export const Flag: Icon;
  export const Activity: Icon;
  export const Clock: Icon;
  export const Zap: Icon;
  export const Calendar: Icon;
}

declare module 'firebase/storage' {
  export function getStorage(app: any): any;
  export function ref(storage: any, path: string): any;
  export function uploadBytes(ref: any, data: any): Promise<any>;
  export function getBytes(ref: any): Promise<Uint8Array>;
  export function getDownloadURL(ref: any): Promise<string>;
}
