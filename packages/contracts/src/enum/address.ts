export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
}
