import { View as RNView, type ViewProps as RNViewProps } from 'react-native';

export function View(props: RNViewProps) {
  return <RNView {...props} />;
}
