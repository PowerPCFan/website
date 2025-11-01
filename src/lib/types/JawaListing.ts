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
    seller: {
        name: string | null;
        verified: boolean | null;
        pfp: string | null;
        profile_url: string | null;
        reviews: {
            count: number | null;
            stars: number | null;
            url: string | null;
        }
    }
}

export interface JawaListingCollection {
    listings: JawaListing[];
}
