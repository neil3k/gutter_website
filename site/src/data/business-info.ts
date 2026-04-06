export interface BusinessAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface ServiceInfo {
  name: string;
  description: string;
}

export interface BusinessInfo {
  name: string;
  address: BusinessAddress;
  telephone: string;
  email: string;
  url: string;
  googleBusinessUrl: string;
  serviceAreaLocalities: string[];
  services: ServiceInfo[];
}

export const businessInfo: BusinessInfo = {
  name: "Warboys Gutter Clearing",
  address: {
    streetAddress: "Warboys",
    addressLocality: "Warboys",
    addressRegion: "Cambridgeshire",
    postalCode: "PE28",
    addressCountry: "GB",
  },
  telephone: "07936085632",
  email: "warboysgutterclearing@btinternet.com",
  url: "https://warboysgutterclearing.co.uk",
  googleBusinessUrl: "https://search.google.com/local/reviews",
  serviceAreaLocalities: [
    "Warboys", "Ramsey", "St Ives", "Huntingdon", "Somersham",
    "Chatteris", "March", "Ely", "St Neots", "Godmanchester", "Sawtry",
  ],
  services: [
    {
      name: "Gutter Clearing",
      description: "Complete debris removal from gutters by hand or using the Predator specialist gutter vacuum system.",
    },
    {
      name: "Downpipe Unblocking",
      description: "Clearing blocked downpipes to restore proper drainage and protect your property from water damage.",
    },
    {
      name: "Supply & Installation of Downpipe Gutter Guards",
      description: "Professionally fitted gutter guards to prevent future blockages from leaves and debris.",
    },
  ],
};
