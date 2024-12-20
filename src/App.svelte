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
    let startStreak = false;
    let message = '';
    let language = '';
    let result = '';
    let wordCount = 30;
    let streak = 0;
    let languageError = false;
    let streakGoalError = false;
    let depositError = false;
  
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
      if(wordCount <= 0){
        wordCount = 0;
        await handleRecordProgress();
        return;
      }
      wordCount -= Math.floor(message.length / 5);
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
    <h1>Language Learner</h1>
  
    {#if walletConnected}  
      {#if startStreak}
      <div class="flex-container start-streak-container">
        {#if !streakGoalError}
        <label>
          Streak Goal (days):
          <input type="number" bind:value={streakGoal} min="1" />
        </label>
        {:else}
        <label>
          Streak Goal (days):
          <input class="error" type="number" bind:value={streakGoal} min="1" />
        </label>
        {/if}
        {#if !depositError}
        <label>
          Deposit Amount (ETH):
          <input type="number" step="0.001" bind:value={depositAmount} />
        </label>
        {:else}
        <label>
          Deposit Amount (ETH):
          <input class="error" type="number" step="0.001" bind:value={depositAmount} />
        </label>
        {/if}
        <button on:click={handleDeposit} class="ss-button"><h2>Start Streak!</h2></button>
      </div>
      {:else if startLearn}
        <section>
          <h2>{wordCount} Words Left!</h2>
          <div>
            <p>{result}</p>
          </div>
          <input type="text" name="word" id="word" bind:value={message}>
          <button on:click={()=>{handleMessaging()}}>Enter</button>
        </section>
      {:else}
      <div class="flex-container">
        {#if streak > 0}
        <img src="streak.png" alt="Fire">
        {:else}
        <img src="streak-dead.png" alt="Dead Fire">
        {/if}
        <h1 class="streak">{streak}</h1>
      </div>

      <div class="flex-container">
        <button on:click={()=>{
          startStreak = true;
        }} class="start-streak"><h2>Start Streak</h2></button>
        <button class="continue-streak" on:click={learn}><h2>Continue Streak</h2></button>
      </div>
      {#if !languageError}
      <select bind:value={language} data-placeholder="Language: ">
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
      {:else}
      <select bind:value={language} class="error" data-placeholder="Language: ">
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
      {/if}
      {/if}
    {:else}
      <p>Please connect your wallet to get started.</p>
    {/if}
  </main>
  
  <style>
    .start-streak{
      background: #ff3e3eff;
    }
    .start-streak:hover{
      transition: .2s ease-in;
      background: #d93838ff;
    }
    .start-streak-container{
      flex-flow: column wrap;
    }
    .ss-button{
      background: #ff3e3eff;
    }
    .ss-button:hover{
      transition: .2s ease-in;
      background: #d93838ff;
    }
    .continue-streak{
      background: #346bd0ff;
    }
    .continue-streak:hover{
      transition: .2s ease-in;
      background: #3165c3ff;
    }
    .flex-container{
      display: flex;
      justify-content: center;
    }
    .streak{
      align-self: center;
    }
    img{
      width: 15rem;
    }
    select, input{
      background: none;
      font-family: "Inter", serif;
      font-weight: 300;
      padding: .6rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
      border-radius: 10px;
    }
    .error{
      border: 1px solid red;
    }
  </style>
  