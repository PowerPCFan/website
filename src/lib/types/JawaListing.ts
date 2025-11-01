export interface JawaListing {
    metadata: {
        uuid: string;
        title: string;
        url: string;
    };
    media: {
        thumbnail_url: string;
        images: string[];
    };
    status: {
        price: string | null;
        shipping_cost: number | string | null;
        sold_out: boolean;
    };
    details: {
        description: string;
    };
}

export interface JawaListingCollection {
    listings: JawaListing[];
}
