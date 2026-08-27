import type { ComponentType } from 'react';
import type { DemoCompanyConfig } from '../types';
import { AtVoltDemo } from './at-volt/AtVoltDemo';

export const templateRegistry: Record<string, ComponentType<{ config: DemoCompanyConfig }>> = {
  'at-volt': AtVoltDemo,
};
