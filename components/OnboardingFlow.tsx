import React, { useCallback, useState } from 'react';
import { ChooseProfilePicture } from './ChooseProfilePicture';
import { ConnectToMetamask } from './ConnectToMetamask';
import { LinkSocials } from './LinkSocials';
import { OnboardingAccountCreation } from './OnboardingAccountCreation';
import { OnboardingElements } from './OnboardingElements';

const OnboardingFlow = () => {
  return (
    <OnboardingElements>
      <ConnectToMetamask />
      <OnboardingAccountCreation />
      <ChooseProfilePicture />
      <LinkSocials />
    </OnboardingElements>
  );
};

export default OnboardingFlow;
