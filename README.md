**PROJECT: Decentralized Star Notary Service Project**

```bash
cd app
# Remove the node_modules
# remove packages
rm -rf node_modules
# clean cache
npm cache clean
rm package-lock.json
# initialize npm (you can accept defaults)
npm init
# install all modules listed as dependencies in package.json
npm install
```

2. Start Truffle by running

```bash
# For starting the development console
truffle develop
# truffle console

# For compiling the contract, inside the development console, run:
compile

# For migrating the contract to the locally running Ethereum network, inside the development console
migrate --reset

# For running unit tests the contract, inside the development console, run:
test
```

3. Frontend - Once you are ready to start your frontend, run the following from the app folder:

```bash
cd app
npm run dev
```

---

### Important

When you will add a new Rinkeyby Test Network in your Metamask client, you will have to provide:

| Network Name      | New RPC URL              | Chain ID |
| ----------------- | ------------------------ | -------- |
| Private Network 1 | `http://127.0.0.1:9545/` | 1337     |

The chain ID above can be fetched by:

```bash
cd app
node index.js
```

**Solution:** In such a case, ensure the following in `truffle-config.js`:

```js
// Configure your compilers
compilers: {
  solc: {
    version: "0.5.16", // <- Use this
    // docker: true,
    // ...
```
