export interface AddressProps {
    id: string;
    city: string;
    district: string;
    street: string;
    number: string;
    postalCode: string;
    state: string;
    complement?: string | null;
    isMain: boolean;
}
