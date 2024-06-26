# Zukyc

This is an example app using POD & GPC.
For details about POD & GPC, see [this doc](https://0xparc.notion.site/POD-GPC-Development-6547d2e60c184ad0984f933672246e0b#25ea9b2a90464663b36486f5e6064106).

## Example use case

This example app demonstrated an end to end use case for POD & GPC. The story goes, Gerry would like to borrow some money, so he goes to ZooLender. The ZooLender wants him to prove that he has a valid ID, and has monthly income over $X amount, among other things. Gerry doesn't know ZooLender well, so he doesn't feel comfortable to send him his ID and paystubs. So they decide to use ZooKyc (in `gpc-prover-client`).

To use ZooKyc, Gerry first goes to ZooGov (in `pod-issuer-client/app/gov`, `pod-issuer-server`), and ZooGov issues him an ID POD signed by ZooGov. Gerry then goes to ZooDeel (in `pod-issuer-client/app/deel`, `pod-issuer-server`), and ZooDeel issues him a Paystub POD signed by ZooDeel. All the PODs have a owner field with Gerry's Semaphore public identity.

Gerry then goes to ZooKyc with his ID POD, Paystub POD, and Semaphore identity. ZooKyc creates a ZK proof that Gerry has a valid ID, and has monthly income over $X amount, without leaking other information. ZooKyc is a browser only app. In fact, Gerry can take the code from ZooKyc and run it himself.
Now with the proof generated by ZooKyc, Gerry goes back to ZooLender (in `gpc-verifier-client`). ZooLender verifies the proof, and lends Gerry the money.

## Example code

- How to issue PODs: [code](https://github.com/proofcarryingdata/zukyc/blob/main/apps/pod-issuer-server/src/index.ts#L41-L62)
- How to create GPC proofs: [code](https://github.com/proofcarryingdata/zukyc/blob/main/apps/gpc-prover-client/app/util/generateProof.ts)
- How to verify GPC proofs: [code](https://github.com/proofcarryingdata/zukyc/blob/main/apps/gpc-verifier/app/util/verifyProof.ts)

## What's inside?

This Turborepo includes the following apps:

### Apps

- `pod-issuer-client`: this is a [Next.js](https://nextjs.org/) app where the user can submit their information and request PODs.
- `pod-issuer-server`: this is an Express server which gets the request from the client, once verifies the information is valid, issues PODs to the user.
- `gpc-prover-client`: this is a [Next.js](https://nextjs.org/) app which uses the GPC library to generate ZK proofs. GPCs can prove properties of one POD or serveral PODs together. PODs can be proven to be owned by the prover, using their Semaphore identity.
- `gpc-verifier`: this is a [Next.js](https://nextjs.org/) app which uses the GPC library to verify ZK proofs. I didn't build a server side app for this, because the verification code would be similar. But in reality, the proof needs to be verified on the server side too.

### Turborepo

This project was bootstrapped with [Turborepo starter](https://github.com/vercel/turbo/tree/main/examples/basic) by running the following command:

```sh
npx create-turbo@latest -e with-yarn
```

## Getting started

### Build

To build all apps and packages, run the following command:

```
cd zukyc
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd zukyc
yarn dev
```
