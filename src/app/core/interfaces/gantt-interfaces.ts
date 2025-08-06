export interface Task {
    id: number;
    start_date: string;
    text: string;
    progress: number;
    duration?: number;
    parent?: number;
}

export class Link {
    id!: number;
    source!: number;
    target!: number;
    type!: string;
}

export interface Project {
    id: string;
    key: string;
    name: string;
}
export interface Sprint{
    name: string;
}