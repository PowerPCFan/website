export interface SellerInfo {
    profile: {
        url: string;
        picture: string;
        name: string;
        verified: boolean;
        followers: number;
        sold: number;
    };
    reviews: {
        count: number;
        stars: number;
        url: string;
    };
    images: string[];
    heading: string;
}

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
        shipping_cost: number | null;
        sold_out: boolean;
    };
    details: {
        description: string;
    };
}

export interface JawaSellerData {
    seller_info: SellerInfo;
    listings: JawaListing[];
}
