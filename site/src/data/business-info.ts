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
    "Chatteris", "March", "St Neots", "Godmanchester", "Sawtry",
    "Woodhurst", "Woodwalton", "Earith", "Old Hurst", "Ramsey Heights/St Mary's",
  ],
  services: [
    {
      name: "Gutter Clearing",
      description:
        "Using a powerful professional gutter vacuum system — safe, efficient, and no need for ladders in most cases.",
    },
    {
      name: "Gutter Guard Installation",
      description:
        "To help prevent blockages and reduce future maintenance.",
    },
    {
      name: "Downpipe Clearing & Minor Maintenance",
      description:
        "Clearing blocked downpipes and minor gutter repairs to restore proper drainage and protect your property.",
    },
    {
      name: "Domestic & Small Commercial Properties",
      description:
        "We serve both domestic homes and small commercial properties across Warboys and the surrounding areas.",
    },
  ],
};
