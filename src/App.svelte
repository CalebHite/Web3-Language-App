<script>
    import { onMount } from 'svelte';
    import {
      connectWallet,
      connectContract,
      deposit,
      recordProgress,
      forfeitStreak,
      distributePool,
      startConversation,
      sendMessage,
    } from './web3.js';

  
    let walletConnected = false;
    let streakGoal = '';
    let depositAmount = '';
    let distributionAddress = '';
    let distributionAmount = '';
    let startLearn = false;
    let message = '';
    let language = 'German';
    let result = '';
    let messageCount = 5;
  
    onMount(async () => {
      try {
        await connectWallet();
        await connectContract();
        walletConnected = true;
      } catch (error) {
        console.error('Error connecting wallet or contract:', error);
      }
    });
  
    async function handleDeposit() {
      try {
        await deposit(streakGoal, depositAmount);
        alert('Deposit successful!');
      } catch (error) {
        alert('Failed to deposit: ' + error.message);
      }
    }
  
    async function handleRecordProgress() {
      try {
        await recordProgress();
        alert('Progress recorded successfully!');
      } catch (error) {
        alert('Failed to record progress: ' + error.message);
      }
    }

    async function learn(){
      startLearn = true;
      await startConversation(language);
    }

    async function handleMessaging(){
      result = await sendMessage(message);
      messageCount--;
    }
  
    async function handleForfeitStreak() {
      try {
        await forfeitStreak();
        alert('Streak forfeited successfully!');
      } catch (error) {
        alert('Failed to forfeit streak: ' + error.message);
      }
    }
  
    async function handleDistributePool() {
      try {
        await distributePool(distributionAddress, distributionAmount);
        alert('Pool distributed successfully!');
      } catch (error) {
        alert('Failed to distribute pool: ' + error.message);
      }
    }
  </script>
  
  <main>
    <h1>Language Learning App</h1>
  
    {#if walletConnected}
      <section>
        <h2>Start a New Streak</h2>
        <label>
          Streak Goal (days):
          <input type="number" bind:value={streakGoal} min="1" />
        </label>
        <label>
          Deposit Amount (ETH):
          <input type="text" bind:value={depositAmount} />
        </label>
        <button on:click={handleDeposit}>Start Streak</button>
      </section>
  
      <section>
        <h2>Daily Actions</h2>
        <button on:click={learn}>Learn to Continue Streak!</button>
      </section>

      {#if startLearn}
        <section>
          <h2>{messageCount} Reponses Left!</h2>
          <input type="text" name="word" id="word" bind:value={message}>
          <button on:click={()=>{handleMessaging(); console.log(messageCount)}}>Enter</button>
          <p>{result}</p>
        </section>
      {/if}
    {:else}
      <p>Please connect your wallet to get started.</p>
    {/if}
  </main>
  
  <style>
    main {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
    }
  
    section {
      margin-bottom: 20px;
    }
  
    label {
      display: block;
      margin-bottom: 10px;
    }
  
    button {
      display: block;
      margin-top: 10px;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #0056b3;
    }
  </style>
  