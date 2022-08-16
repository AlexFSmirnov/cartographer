import { InferableComponentEnhancerWithProps } from 'react-redux';

export type StoreProps<Connect> = Connect extends InferableComponentEnhancerWithProps<
    infer Props,
    any
>
    ? Props
    : never;
