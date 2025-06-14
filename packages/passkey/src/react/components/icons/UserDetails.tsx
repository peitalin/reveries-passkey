import { NEAR_EXPLORER_BASE_URL, WEBAUTHN_CONTRACT_ID } from "../../../config";

export const UserDetails = ({ username, isOpen }: { username: string, isOpen: boolean }) => {
  return (
    <div className="web3authn-profile-dropdown-user-details">
      <p className="web3authn-profile-dropdown-username">
        {username || 'User'}
      </p>
      <a
        href={username ? `${NEAR_EXPLORER_BASE_URL}/accounts/${username}.${WEBAUTHN_CONTRACT_ID}` : '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`web3authn-profile-dropdown-account-id ${isOpen ? 'visible' : 'hidden'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {username ? `${username}.${WEBAUTHN_CONTRACT_ID}` : 'user@example.com'}
      </a>
    </div>
  );
};