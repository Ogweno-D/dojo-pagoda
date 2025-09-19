import type {IconProps} from "./Icon.types.ts";
import clsx from "clsx";


export function Icon({
                          children,
                         size = "medium",
                         decorative = false,
                         color,
                      }: IconProps)
{
    return (
        <span
            className={clsx(`icon-${size}`)}
            style={{ color}}
            aria-hidden={decorative ? "true":undefined}
        >
            {children}
        </span>
    )
}