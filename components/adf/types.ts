export interface ADFDoc extends ADFNode {
    version: number;
    type: 'doc';
    content: ADFNode[];
}

export interface ADFNode {
    type: string;
    attrs?: Record<string, any>;
    content?: ADFNode[];
    marks?: ADFMark[];
    text?: string;
}

export interface ADFMark {
    type: string;
    attrs?: Record<string, any>;
}

export interface MediaNode extends ADFNode {
    type: "mediaSingle" | "mediaGroup";
    content: Media[]
}

export interface Media {
    type: "media"
    attrs: {
        id: string;
        type: "file" | "link";
        alt: string;
        width?: number;
        height?: number
    }
}