---
title: "Season 1, Issue 2: The Isolation Trap"
description: "The kitchen is closed. There's one light still on and one message he keeps deleting. Virgil asks who's actually saying no."
date: 2026-11-26
publishDate: 2026-11-24
draft: false
cover:
  image: "/images/comics/s1i2/AIA_S1I2_01_Cover.png"
  alt: "A lone man in a cap and sunglasses sits hunched at a steel prep table under a single pendant lamp in a dark purple kitchen, his phone beside him. Title: Awareness In Action Comics, Season 1, Issue 2: The Isolation Trap. Tagline: When the room goes quiet."
  relative: false
---

**Previously:** During a holiday rush, Virgil helped the hero see where the work was stuck and who was already there to help. [Read Issue 1](/comics/season-1-issue-1/)

<div class="s1i2-sound"><button type="button" class="s1i2-sound-btn" aria-pressed="false" aria-controls="s1i2-ambience"><span class="s1i2-sound-label">Sound: Off</span></button><audio id="s1i2-ambience" src="/audio/comics/s1i2/AIA_S1I2_kitchen_ambience.mp3" loop preload="none"></audio></div>
<style>
.comic-issue .s1i2-sound { padding-inline: var(--gap); margin: 0 0 1rem; }
.comic-issue .s1i2-sound-btn { min-height: 44px; padding: .5rem 1.15rem; border: 1px solid var(--border); border-radius: 999px; background: var(--entry); color: var(--primary); font: inherit; font-weight: 600; cursor: pointer; touch-action: manipulation; }
.comic-issue .s1i2-sound-btn[aria-pressed="true"] { background: var(--primary); color: var(--theme); }
.comic-issue .s1i2-sound-btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
</style>
<script>
// Issue 2 sound. Off by default, never autoplays: nothing makes noise until the reader presses the button.
(function () {
  var root = document.querySelector('.comic-issue');
  var btn = root && root.querySelector('.s1i2-sound-btn');
  var amb = root && root.querySelector('#s1i2-ambience');
  if (!btn || !amb) return;
  var label = btn.querySelector('.s1i2-sound-label');
  var vids = [].slice.call(root.querySelectorAll('video'));
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var on = false, active = null, ratios = new Map(), gain = null, ctx = null;
  var noop = function () {};
  vids.forEach(function (v) { v.muted = true; });
  // Ambience level 0.25. iOS ignores element.volume, so use a Web Audio gain there.
  amb.volume = 0.25;
  if (amb.volume !== 0.25) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC(); gain = ctx.createGain(); gain.gain.value = 0.25;
      ctx.createMediaElementSource(amb).connect(gain); gain.connect(ctx.destination);
    } catch (e) { ctx = null; }
  }
  function apply() {
    vids.forEach(function (v) { v.muted = !(on && !reduced && v === active); });
  }
  function update() {
    if (!reduced) {
      vids.forEach(function (v) {
        var vis = (ratios.get(v) || 0) > 0;
        if (vis && v.paused) { if (v._s1i2off) v.currentTime = 0; v._s1i2off = false; var p = v.play(); if (p && p.catch) p.catch(noop); }
        else if (!vis && !v.paused) { v.pause(); v._s1i2off = true; }
      });
    }
    var best = null, br = 0.45;
    vids.forEach(function (v) { var r = ratios.get(v) || 0; if (r >= br) { br = r; best = v; } });
    active = best; apply();
  }
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0); });
      update();
    }, { threshold: [0, 0.25, 0.45, 0.6, 0.8, 1] });
    vids.forEach(function (v) { io.observe(v); });
  }
  function setOn(next) {
    on = next;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    label.textContent = 'Sound: ' + (on ? 'On' : 'Off');
    if (on) {
      if (ctx && ctx.resume) ctx.resume();
      var p = amb.play(); if (p && p.catch) p.catch(function () { setOn(false); });
      // Inside this tap: unlock the inline videos for sound (iOS Safari), then apply() re-mutes all but the visible one.
      if (!reduced) vids.forEach(function (v) { v.muted = false; var q = v.play(); if (q && q.catch) q.catch(noop); });
      update();
    } else {
      amb.pause(); apply();
    }
  }
  btn.addEventListener('click', function () { setOn(!on); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) amb.pause();
    else if (on) { var p = amb.play(); if (p && p.catch) p.catch(noop); }
  });
})();
</script>

<video class="comic-slide" src="/videos/comics/s1i2/AIA_S1I2_01_Cover.mp4" poster="/images/comics/s1i2/AIA_S1I2_01_Cover.png" autoplay muted loop playsinline preload="metadata" role="img" aria-label="A lone man in a cap and sunglasses sits hunched at a steel prep table under a single pendant lamp in a dark purple kitchen, his phone beside him. Title: Awareness In Action Comics, Season 1, Issue 2: The Isolation Trap. Tagline: When the room goes quiet."><img class="comic-slide" src="/images/comics/s1i2/AIA_S1I2_01_Cover.png" alt="A lone man in a cap and sunglasses sits hunched at a steel prep table under a single pendant lamp in a dark purple kitchen, his phone beside him. Title: Awareness In Action Comics, Season 1, Issue 2: The Isolation Trap. Tagline: When the room goes quiet." loading="eager"></video>

<video class="comic-slide" src="/videos/comics/s1i2/AIA_S1I2_02_After_Close.mp4" poster="/images/comics/s1i2/AIA_S1I2_02_After_Close.png" autoplay muted loop playsinline preload="metadata" role="img" aria-label="A wide view from a dark dining room, chairs stacked on the tables, into the closed kitchen. The hero, wearing a backpack, reaches for the light switch while the small robot Virgil sits on the prep counter under the one pendant lamp still on. Caption: Marcus works the grill beside me. He left at 11:30. I said I&#x27;d lock up. Didn&#x27;t want to fake fine."><img class="comic-slide" src="/images/comics/s1i2/AIA_S1I2_02_After_Close.png" alt="A wide view from a dark dining room, chairs stacked on the tables, into the closed kitchen. The hero, wearing a backpack, reaches for the light switch while the small robot Virgil sits on the prep counter under the one pendant lamp still on. Caption: Marcus works the grill beside me. He left at 11:30. I said I&#x27;d lock up. Didn&#x27;t want to fake fine." loading="lazy"></video>

<video class="comic-slide" src="/videos/comics/s1i2/AIA_S1I2_03_The_Unsent_Message.mp4" poster="/images/comics/s1i2/AIA_S1I2_03_The_Unsent_Message.png" autoplay muted loop playsinline preload="metadata" role="img" aria-label="Over the hero&#x27;s shoulder, a close-up of his purple phone. Marcus (Grill) texted at 11:41 PM, &quot;You went real quiet after the rush,&quot; and at 11:47 PM, &quot;Still at the shop? You good?&quot; The hero types &quot;Honestly, no. You got a minute?&quot;, erases it, and types it again without sending. Captions: Marcus texted anyway. I typed the truth twice. Erased it twice."><img class="comic-slide" src="/images/comics/s1i2/AIA_S1I2_03_The_Unsent_Message.png" alt="Over the hero&#x27;s shoulder, a close-up of his purple phone. Marcus (Grill) texted at 11:41 PM, &quot;You went real quiet after the rush,&quot; and at 11:47 PM, &quot;Still at the shop? You good?&quot; The hero types &quot;Honestly, no. You got a minute?&quot;, erases it, and types it again without sending. Captions: Marcus texted anyway. I typed the truth twice. Erased it twice." loading="lazy"></video>

<video class="comic-slide" src="/videos/comics/s1i2/AIA_S1I2_04_The_Trap.mp4" poster="/images/comics/s1i2/AIA_S1I2_04_The_Trap.png" autoplay muted loop playsinline preload="metadata" role="img" aria-label="The hero sits alone at the end of the steel table under the lamp, looking down at his phone, with Virgil resting beside him and an empty chair at the edge of the light. Hero: &quot;He opens at six. He&#x27;s got enough going on.&quot; Caption: Easier to kill the draft than be a problem."><img class="comic-slide" src="/images/comics/s1i2/AIA_S1I2_04_The_Trap.png" alt="The hero sits alone at the end of the steel table under the lamp, looking down at his phone, with Virgil resting beside him and an empty chair at the edge of the light. Hero: &quot;He opens at six. He&#x27;s got enough going on.&quot; Caption: Easier to kill the draft than be a problem." loading="lazy"></video>

<img class="comic-slide" src="/images/comics/s1i2/AIA_S1I2_05_Virgils_Question.png" alt="Virgil walks into the pool of lamplight at the far end of the table, one hand open toward the hero, who sits with his chin on his fist. An empty chair stands in the foreground. Virgil: &quot;Did he say no—or did you?&quot;" loading="lazy">

<video class="comic-slide" src="/videos/comics/s1i2/AIA_S1I2_06_One_Reach.mp4" poster="/images/comics/s1i2/AIA_S1I2_06_One_Reach.png" autoplay muted loop playsinline preload="metadata" role="img" aria-label="The hero holds his phone up toward the viewer at 11:58. Under Marcus&#x27;s two messages, his reply, &quot;Honestly, no. You got a minute?&quot;, is sent and marked Delivered, with no answer yet. Caption: I let Marcus answer for himself."><img class="comic-slide" src="/images/comics/s1i2/AIA_S1I2_06_One_Reach.png" alt="The hero holds his phone up toward the viewer at 11:58. Under Marcus&#x27;s two messages, his reply, &quot;Honestly, no. You got a minute?&quot;, is sent and marked Delivered, with no answer yet. Caption: I let Marcus answer for himself." loading="lazy"></video>

<video class="comic-slide" src="/videos/comics/s1i2/AIA_S1I2_07_The_Room_Stays_Quiet.mp4" poster="/images/comics/s1i2/AIA_S1I2_07_The_Room_Stays_Quiet.png" autoplay muted loop playsinline preload="metadata" role="img" aria-label="Back in the wide kitchen view, the phone lies on the steel table under the same lamp and chair. The hero, standing, takes his purple jacket from a hook by the door while Virgil waits beside it. Caption: The room stayed quiet. I&#x27;d finally stopped answering for him. Sign-off: This is how you Control Your World."><img class="comic-slide" src="/images/comics/s1i2/AIA_S1I2_07_The_Room_Stays_Quiet.png" alt="Back in the wide kitchen view, the phone lies on the steel table under the same lamp and chair. The hero, standing, takes his purple jacket from a hook by the door while Virgil waits beside it. Caption: The room stayed quiet. I&#x27;d finally stopped answering for him. Sign-off: This is how you Control Your World." loading="lazy"></video>

<a href="https://timothywheels.substack.com"><video class="comic-slide" src="/videos/comics/s1i2/AIA_S1I2_08_End_Card.mp4" poster="/images/comics/s1i2/AIA_S1I2_08_End_Card.png" autoplay muted loop playsinline preload="metadata" role="img" aria-label="End card: the empty, dark kitchen with its door ajar and a narrow stripe of warm light across the floor. Text: Awareness In Action Comics. Get the next issue in your inbox. Opens the newsletter signup."><img class="comic-slide" src="/images/comics/s1i2/AIA_S1I2_08_End_Card.png" alt="End card: the empty, dark kitchen with its door ajar and a narrow stripe of warm light across the floor. Text: Awareness In Action Comics. Get the next issue in your inbox. Opens the newsletter signup." loading="lazy"></video></a>

Get the next issue in your inbox: [https://timothywheels.substack.com](https://timothywheels.substack.com)
