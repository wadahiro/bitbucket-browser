export type Type = '' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
export type Size = '' | 'small' | 'medium' | 'large';

export function type(type: Type = null) {
    return type === null ? '' : `is-${type}`;
}

export function size(size: Size = null) {
    return size === null ? '' : `is-${size}`;
}