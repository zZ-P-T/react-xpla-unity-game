mergeInto(LibraryManager.library, {
  ConnectWallet: function () {
    window.dispatchReactUnityEvent("ConnectWallet");
  },

  DisconnectWallet: function () {
    window.dispatchReactUnityEvent("DisconnectWallet");
  },

  GetXplaAmount: function () {
    window.dispatchReactUnityEvent("GetXplaAmount");
  },

  GetContractInfo: function (contract) {
    window.dispatchReactUnityEvent("GetContractInfo", UTF8ToString(contract));
  },

  GetContractQuery: function (contract, query) {
    window.dispatchReactUnityEvent("GetContractQuery", UTF8ToString(contract), UTF8ToString(query));
  },

  GetCW20TokenInfo: function (contract) {
    window.dispatchReactUnityEvent("GetCW20TokenInfo", UTF8ToString(contract));
  },

  GetCW20Balance: function (contract) {
    window.dispatchReactUnityEvent("GetCW20Balance", UTF8ToString(contract));
  },

  GetCW721Tokens: function (contract) {
    window.dispatchReactUnityEvent("GetCW721Tokens", UTF8ToString(contract));
  },

  GetCW721TokenInfo: function (contract, token_id) {
    window.dispatchReactUnityEvent("GetCW721TokenInfo", UTF8ToString(contract), UTF8ToString(token_id));
  },

  PostTx: function () {
    window.dispatchReactUnityEvent("PostTx");
  },

  GetTxResult: function () {
    window.dispatchReactUnityEvent("GetTxResult");
  },

  SendToken: function (token, recipient, amount, txmemo) {
    window.dispatchReactUnityEvent("SendToken", UTF8ToString(token), UTF8ToString(recipient), UTF8ToString(amount), UTF8ToString(txmemo));
  },

  SendNFT: function (contract, recipient, token_id, txmemo) {
    window.dispatchReactUnityEvent("SendNFT", UTF8ToString(contract), UTF8ToString(recipient), UTF8ToString(token_id), UTF8ToString(txmemo));
  },

  ExecuteContract: function (contract, execute_msg, txmemo) {
    window.dispatchReactUnityEvent("ExecuteContract", UTF8ToString(contract), UTF8ToString(execute_msg), UTF8ToString(txmemo));
  },
});