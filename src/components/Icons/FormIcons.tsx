import * as React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
};

export const VideoIcon = ({
                              size = 18,
                              color = 'currentColor',
                              strokeWidth = 1.5,
                              ...props
                          }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
        {...props}
    >
        <path
            d="M16.9049 4.815C16.8159 4.45906 16.6344 4.13293 16.3789 3.86955C16.1235 3.60618 15.803 3.41489 15.4499 3.315C14.1599 3 8.99994 3 8.99994 3C8.99994 3 3.83994 3 2.54994 3.345C2.19688 3.44489 1.87642 3.63618 1.62095 3.89955C1.36548 4.16293 1.18403 4.48906 1.09494 4.845C0.858851 6.15417 0.743367 7.48223 0.74994 8.8125C0.741525 10.1528 0.857016 11.491 1.09494 12.81C1.19316 13.1549 1.37867 13.4686 1.63355 13.7209C1.88843 13.9731 2.20406 14.1554 2.54994 14.25C3.83994 14.595 8.99994 14.595 8.99994 14.595C8.99994 14.595 14.1599 14.595 15.4499 14.25C15.803 14.1501 16.1235 13.9588 16.3789 13.6954C16.6344 13.4321 16.8159 13.1059 16.9049 12.75C17.1392 11.4507 17.2547 10.1328 17.2499 8.8125C17.2584 7.47222 17.1429 6.13402 16.9049 4.815V4.815Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7.3125 11.265L11.625 8.81249L7.3125 6.35999V11.265Z"
            fill={color}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const PhotoIcon = ({
                              size = 18,
                              color = 'currentColor',
                              strokeWidth = 1.5,
                              ...props
                          }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
        {...props}
    >
        <path
            d="M14.25 2.25H3.75C2.92157 2.25 2.25 2.92157 2.25 3.75V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V3.75C15.75 2.92157 15.0784 2.25 14.25 2.25Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.375 7.5C6.99632 7.5 7.5 6.99632 7.5 6.375C7.5 5.75368 6.99632 5.25 6.375 5.25C5.75368 5.25 5.25 5.75368 5.25 6.375C5.25 6.99632 5.75368 7.5 6.375 7.5Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15.75 11.25L12 7.5L3.75 15.75"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);



