// === REACT CONTEXT ===
export { PasskeyProvider, usePasskeyContext } from './context/index';

// === REACT HOOKS ===
export { useOptimisticAuth } from './hooks/useOptimisticAuth';
export { useNearRpcProvider } from './hooks/useNearRpcProvider';

// === REACT COMPONENTS ===
export { ProfileButton } from './components/ProfileButton';

// === TYPES ===
export type {
  LoginState,
  PasskeyContextType,
  PasskeyContextProviderProps,
  RegistrationResult,
  LoginResult,
  ExecuteActionCallbacks,
  ActionExecutionResult,
  ToastOptions,
  ToastStyleOptions,
  ManagedToast,
  NearRpcProviderHook,
  OptimisticAuthOptions,
  OptimisticAuthHook,
  // Re-exported from PasskeyManager types
  RegistrationOptions,
  LoginOptions,
  ActionOptions,
  RegistrationSSEEvent,
  LoginEvent,
  ActionEvent
} from './types';

// === PROFILE BUTTON TYPES ===
export type {
  ProfileDimensions,
  ProfileAnimationConfig,
  ProfileMenuItem,
  ProfileButtonProps,
  ProfileTriggerProps,
  ProfileDropdownProps,
  ProfileMenuItemProps,
  ProfileToggleSectionProps,
  ProfileLogoutSectionProps,
  ProfileStateRefs,
  ProfileCalculationParams,
} from './components/ProfileButton/types';

// === RE-EXPORT CORE ===
export type { PasskeyConfig, UserData } from '../core/types';
export { PasskeyManager } from '../core/PasskeyManager';