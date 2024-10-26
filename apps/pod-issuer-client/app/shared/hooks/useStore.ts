"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface EmailJwtPayload extends JwtPayload {
  email: string;
}

interface State {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  email: string | null;
  setEmail: (email: string | null) => void;

  govToken: string | null;
  setGovToken: (token: string | null) => void;

  deelToken: string | null;
  setDeelToken: (token: string | null) => void;

  idPOD: string | null;
  setIdPOD: (pod: string | null) => void;

  paystubPOD: string | null;
  setPaystubPOD: (pod: string | null) => void;

  semaphorePublicKey: string | null;
  setsemaphorePublicKey: (publicKey: string | null) => void;
}

const useStore = create<State>()(
  devtools(
    persist(
      immer((set) => ({
        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          });
        },

        email: null,
        setEmail: (email) => set(() => ({ email })),

        govToken: null,
        setGovToken: (token) => {
          set((state) => {
            state.govToken = token;
            if (token) {
              const decodedToken = jwtDecode<EmailJwtPayload>(token);
              state.email = decodedToken.email;
            }
          });
        },

        deelToken: null,
        setDeelToken: (token) => {
          set((state) => {
            state.deelToken = token;
            if (token) {
              const decodedToken = jwtDecode<EmailJwtPayload>(token);
              state.email = decodedToken.email;
            }
          });
        },

        idPOD: null,
        setIdPOD: (pod) => set(() => ({ idPOD: pod })),

        paystubPOD: null,
        setPaystubPOD: (pod) => set(() => ({ paystubPOD: pod })),

        semaphorePublicKey: null,
        setsemaphorePublicKey: (publicKey) =>
          set(() => ({ semaphorePublicKey: publicKey }))
      })),
      {
        name: "Store",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        }
      }
    )
  )
);

export default useStore;
