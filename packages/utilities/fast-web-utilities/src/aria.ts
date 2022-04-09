export const Orientation = {
    horizontal: "horizontal",
    vertical: "vertical",
} as const;

export type Orientation = typeof Orientation[keyof typeof Orientation];
