<script>
    import { onMount } from 'svelte';
    import {
      connectWallet,
      connectContract,
      deposit,
      recordProgress,
      forfeitStreak,
      distributePool,
      getUserStreakData,
      startConversation,
      sendMessage,
    } from './web3.js';

  
    let walletConnected = false;
    let streakGoal = '';
    let depositAmount = '';
    let distributionAddress = '';
    let distributionAmount = '';
    let startLearn = false;
    let startStreak = false;
    let message = '';
    let language = '';
    let result = '';
    let progress = 0;
    let languageError = false;
    let streakGoalError = false;
    let depositError = false;
    let streakData = {};
  
    onMount(async () => {
      try {
        await connectWallet();
        await connectContract();
        streakData = await getUserStreakData();
        console.log(streakData.currentStreak);
        walletConnected = true;
      } catch (error) {
        console.error('Error connecting wallet or contract:', error);
      }
    });
  
    async function handleDeposit() {
      if(streakGoal === '' || streakGoal == 0){
        streakGoalError = true;
      }
      else if(depositAmount === '' || depositAmount == 0){
        depositError = true;
      }
      else{
        try {
        streakGoalError = false;
        depositError = false;
        await deposit(streakGoal, String(depositAmount));
        alert('Deposit successful!');
      } catch (error) {
        alert('Failed to deposit: ' + error.message);
      }
      startStreak = false;
      }
    }
  
    async function handleRecordProgress() {
      startLearn = false;
      try {
        await recordProgress();
        alert('Progress recorded successfully!');
      } catch (error) {
        alert('Failed to record progress: ' + error.message);
      }
    }

    async function learn(){
      if(language != ''){
        languageError = false
        startLearn = true;
        await startConversation(language);
      }
      else{
        languageError = true;
      }
    }

    async function handleMessaging(){
      if(progress >= 100){
        progress = 100;
        await handleRecordProgress();
        return;
      }
      progress += (Math.floor(message.length / 5) *2);
      result = await sendMessage(message);
      message = "";
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
    {#if walletConnected}
      {#if startStreak}
      <div class="flex-container column start-streak-container">
        <h1>Start Streak to Earn ETH!</h1>
        <div class="input-group">
          <label>
            Streak Goal (days):
            <input class="{streakGoalError ? 'error' : ''}" type="number" bind:value={streakGoal} min="1" />
          </label>
          <label>
            Deposit Amount (ETH):
            <input class="{depositError ? 'error' : ''}" type="number" step="0.001" bind:value={depositAmount} />
          </label>
        </div>
        <button on:click={handleDeposit} class="ss-button">Start Streak!</button>
      </div>
      {:else if startLearn}
      <div class="flex-container column">
        <h2>Complete Learning to Continue Streak!</h2>
        <div class="text-box">
          <progress max="100" value={progress}>{progress}%</progress>
          <p>{result}</p>
          <div class="flex-container row">
            <input type="text" name="word" id="word" bind:value={message} placeholder="Type your message">
            <button on:click={handleMessaging}>Enter</button>
          </div>
        </div>
      </div>
      {:else}
      <div class="flex-container column streak-container">
        <img src="./globe.png" alt="globe">
        <h1 class="streak">{streakData.currentStreak > 0 ? `${streakData.currentStreak} Day Streak!` : "No Active Streak"}</h1>
        <h3 class="streak-goal" if={streakData.streakGoal > 0}>Streak Goal: {streakData.streakGoal}</h3>
        {#if streakData.streakGoal <= 0}
        <button on:click={() => startStreak = true} class="start-streak">Start Streak</button>
        {/if}
        <button class="continue-streak" on:click={learn}>Continue Streak</button>
        <select class="{languageError ? 'error' : ''}" bind:value={language}>
          <option value="" disabled selected>Select Language</option>
        <option value="ES">Spanish</option>
        <option value="DE">German</option>
        <option value="FR">French</option>
        <option value="EN">English</option>
        <option value="AF">Afrikaans</option>
        <option value="SQ">Albanian</option>
        <option value="AR">Arabic</option>
        <option value="HY">Armenian</option>
        <option value="EU">Basque</option>
        <option value="BN">Bengali</option>
        <option value="BG">Bulgarian</option>
        <option value="CA">Catalan</option>
        <option value="KM">Cambodian</option>
        <option value="ZH">Chinese (Mandarin)</option>
        <option value="HR">Croatian</option>
        <option value="CS">Czech</option>
        <option value="DA">Danish</option>
        <option value="NL">Dutch</option>
        <option value="ET">Estonian</option>
        <option value="FJ">Fiji</option>
        <option value="FI">Finnish</option>
        <option value="KA">Georgian</option>
        <option value="EL">Greek</option>
        <option value="GU">Gujarati</option>
        <option value="HE">Hebrew</option>
        <option value="HI">Hindi</option>
        <option value="HU">Hungarian</option>
        <option value="IS">Icelandic</option>
        <option value="ID">Indonesian</option>
        <option value="GA">Irish</option>
        <option value="IT">Italian</option>
        <option value="JA">Japanese</option>
        <option value="JW">Javanese</option>
        <option value="KO">Korean</option>
        <option value="LA">Latin</option>
        <option value="LV">Latvian</option>
        <option value="LT">Lithuanian</option>
        <option value="MK">Macedonian</option>
        <option value="MS">Malay</option>
        <option value="ML">Malayalam</option>
        <option value="MT">Maltese</option>
        <option value="MI">Maori</option>
        <option value="MR">Marathi</option>
        <option value="MN">Mongolian</option>
        <option value="NE">Nepali</option>
        <option value="NO">Norwegian</option>
        <option value="FA">Persian</option>
        <option value="PL">Polish</option>
        <option value="PT">Portuguese</option>
        <option value="PA">Punjabi</option>
        <option value="QU">Quechua</option>
        <option value="RO">Romanian</option>
        <option value="RU">Russian</option>
        <option value="SM">Samoan</option>
        <option value="SR">Serbian</option>
        <option value="SK">Slovak</option>
        <option value="SL">Slovenian</option>
        <option value="SW">Swahili</option>
        <option value="SV">Swedish </option>
        <option value="TA">Tamil</option>
        <option value="TT">Tatar</option>
        <option value="TE">Telugu</option>
        <option value="TH">Thai</option>
        <option value="BO">Tibetan</option>
        <option value="TO">Tonga</option>
        <option value="TR">Turkish</option>
        <option value="UK">Ukrainian</option>
        <option value="UR">Urdu</option>
        <option value="UZ">Uzbek</option>
        <option value="VI">Vietnamese</option>
        <option value="CY">Welsh</option>
        <option value="XH">Xhosa</option>
        </select>
      </div>
      {/if}
    {:else}
      <p>Please connect your wallet to get started.</p>
    {/if}
  </main>
  
  <style>
    main {
      padding: 2rem;
      font-family: "Inter", serif;
    }
  
    .flex-container {
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
    }
  
    .column {
      flex-direction: column;
    }
  
    .row {
      flex-direction: row;
    }
  
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
  
    h1, h2, h3 {
      margin: 1rem 0;
    }
  
    button {
      background: #59CE8F;
      border-radius: 10px;
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      font-size: 1rem;
    }
  
    button:hover {
      background: #48a875;
      transition: 0.2s ease-in;
    }
  
    input, select {
      border: 1px solid #ccc;
      padding: 0.5rem;
      border-radius: 5px;
      width: 100%;
    }
  
    .error {
      border-color: #FF1E00;
    }
  
    .text-box {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background-color: #141414;
      padding: 1rem;
      border-radius: 10px;
      color: white;
    }
  
    progress {
      width: 100%;
      height: 1rem;
      margin-bottom: 1rem;
    }
  
    .streak-container {
      text-align: center;
      gap: 1rem;
    }

    .streak{
      font-family: "Lora", serif;	
      margin: 0;
    }
  
    .streak-goal {
      margin: 0;
    }
  </style>
  