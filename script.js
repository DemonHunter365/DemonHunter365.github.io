
  /*
  ============================================================
  FILE: script.js
  PURPOSE: All interactivity for Harshil's portfolio homepage.

  WHAT THIS FILE DOES:
  1. Navbar background — adds a dark background when user scrolls
  2. Hamburger menu   — opens/closes mobile navigation
  3. Scroll reveal    — animates cards into view when scrolled to
  4. Smooth active link highlight (optional enhancement)

  HOW TO READ THIS FILE:
  Each section has a comment block explaining WHAT it does and WHY.
  ============================================================
*/


/* ============================================================
   WAIT FOR THE PAGE TO FULLY LOAD
   
   'DOMContentLoaded' fires when the browser has finished parsing
   all the HTML and building the DOM (Document Object Model — the
   tree of HTML elements in memory).

   We wrap all our code inside this event listener so that when
   JS runs, all the HTML elements (navbar, cards, etc.) already
   exist and we can find them with getElementById / querySelector.

   Without this, if JS loaded before the HTML, our querySelector
   calls would return null and nothing would work.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     SECTION 1: NAVBAR SCROLL EFFECT
     
     GOAL: When the user scrolls down the page, add a dark
     semi-transparent background to the navbar so it's readable
     against any page content behind it.
     
     HOW IT WORKS:
     - We select the <header id="navbar"> element.
     - We listen for the 'scroll' event on the window.
     - Every time the user scrolls, we check window.scrollY
       (how many pixels from the top).
     - If scrolled more than 50px → add class "scrolled"
     - If back at top → remove class "scrolled"
     - The CSS for .scrolled adds the dark background (in style.css).
     ============================================================ */

  // Find the navbar element in the HTML
  const navbar = document.getElementById('navbar');

  // Run this function every time the user scrolls
  window.addEventListener('scroll', () => {

    // window.scrollY = vertical scroll position in pixels from top
    if (window.scrollY > 50) {
      // User scrolled more than 50px — add the "scrolled" class
      navbar.classList.add('scrolled');
    } else {
      // User is near the top — remove the "scrolled" class
      navbar.classList.remove('scrolled');
    }

  });

  // Also run immediately in case the page loads already scrolled
  // (e.g., user refreshes mid-page)
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  }


  /* ============================================================
     SECTION 2: HAMBURGER MENU (Mobile Navigation)
     
     GOAL: On mobile, clicking the hamburger icon (≡) should
     open the hidden navigation menu. Clicking it again closes it.
     
     HOW IT WORKS:
     - We select the hamburger button and the nav links list.
     - We listen for 'click' on the hamburger button.
     - Each click toggles the class "open" on BOTH elements:
         • On the hamburger: animates ≡ into ✕
         • On the navLinks: shows/hides the mobile menu
     - CSS handles the visual changes when "open" is present
       (see style.css section 4 and 14).
     
     ALSO: Close the menu when a nav link is clicked (so the
     menu doesn't stay open after navigating to a new section).
     ============================================================ */

  // Find the button and the nav menu list
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Toggle menu open/closed on hamburger click
  hamburger.addEventListener('click', () => {

    // .classList.toggle() adds the class if absent, removes if present
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');

  });

  /*
    Close the mobile menu when any nav link is clicked.
    
    We select ALL <a> links inside #navLinks using querySelectorAll.
    This returns a NodeList (like an array) of all matching elements.
    We loop through them with forEach and add a click listener to each.
  */
  navLinks.querySelectorAll('a').forEach(link => {

    link.addEventListener('click', () => {
      // Close menu by removing "open" from both hamburger and navLinks
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });

  });


  /* ============================================================
     SECTION 3: SCROLL REVEAL ANIMATION (Intersection Observer)
     
     GOAL: Elements with class "reveal" should animate in (fade up)
     when they scroll into the visible area of the browser window.
     
     HOW IT WORKS WITHOUT INTERSECTION OBSERVER (old approach):
     You'd listen to the scroll event and manually calculate each
     element's position using getBoundingClientRect(). This runs
     code EVERY pixel you scroll — very slow on many elements.
     
     HOW IT WORKS WITH INTERSECTION OBSERVER (modern approach):
     The browser TELLS US when an element enters/exits the viewport.
     We just say "watch these elements" and handle the event.
     This is much more efficient.
     
     STEP BY STEP:
     1. Create an IntersectionObserver with a callback function.
     2. The callback receives an array of "entries" — each entry
        represents one watched element.
     3. For each entry, if it's intersecting (visible):
         → Add class "visible" → triggers CSS animation
         → Unobserve it (stop watching) so it only animates once
     4. Select all .reveal elements and tell the observer to watch them.
     
     threshold: 0.15 means: fire the callback when 15% of the
     element is visible in the viewport.
     ============================================================ */

  // Create the observer with options
  const revealObserver = new IntersectionObserver(

    // CALLBACK: runs whenever a watched element's visibility changes
    (entries) => {

      entries.forEach(entry => {

        // entry.isIntersecting = true when element is visible
        if (entry.isIntersecting) {

          // Add "visible" class to trigger the CSS animation
          entry.target.classList.add('visible');

          /*
            Stop watching this element after it's animated.
            We only want the animation to play ONCE (when first scrolled to).
            If we didn't unobserve, it would replay every time you scrolled
            past it, which looks bad.
          */
          revealObserver.unobserve(entry.target);
        }

      });

    },

    // OPTIONS: when should the callback fire?
    {
      threshold: 0.15,  // 15% of the element must be visible
      rootMargin: '0px 0px -40px 0px'  
      /* 
        rootMargin shrinks the "trigger zone" by 40px at the bottom.
        This means the animation fires 40px BEFORE the element is
        fully at the bottom edge of the screen, so it looks more
        natural (not triggering right at the last pixel).
      */
    }

  );

  /*
    SELECT all elements with class "reveal" and have the observer watch them.
    querySelectorAll returns a NodeList, forEach loops through it.
  */
  document.querySelectorAll('.reveal').forEach(element => {
    revealObserver.observe(element);
  });


  /* ============================================================
     SECTION 4: CARD HOVER TILT EFFECT (Optional Enhancement)
     
     GOAL: When the mouse moves over a card, slightly tilt the card
     in the direction of the mouse for a 3D feel.
     
     HOW IT WORKS:
     - Listen for 'mousemove' events on each card.
     - Calculate where the mouse is WITHIN the card:
         (mouseX / cardWidth) - 0.5  → gives -0.5 to +0.5
     - Multiply by a tilt amount (e.g., 8 degrees max).
     - Apply CSS transform: rotateY (left/right) and rotateX (up/down).
     - On 'mouseleave', reset the transform back to flat.
     
     perspective() on the card parent creates the 3D space
     needed for rotateX/rotateY to look 3D.
     ============================================================ */

  document.querySelectorAll('.card').forEach(card => {

    // Mouse moves over the card
    card.addEventListener('mousemove', (e) => {

      // Get the card's position and size on screen
      const rect = card.getBoundingClientRect();

      /*
        Calculate mouse position RELATIVE to the card (0 to 1):
        - e.clientX = mouse X on the whole screen
        - rect.left = card's left edge on screen
        - Subtracting gives mouse X within the card
        - Dividing by width gives a 0-to-1 ratio
        - Subtracting 0.5 centers it to -0.5 to +0.5
      */
      const mouseX = (e.clientX - rect.left) / rect.width  - 0.5;
      const mouseY = (e.clientY - rect.top)  / rect.height - 0.5;

      // Max tilt in degrees — adjust this for more/less tilt
      const tiltAmount = 8;

      /*
        Apply 3D rotation:
        - rotateY tilts left/right based on horizontal mouse position
        - rotateX tilts up/down based on vertical mouse position
        - Note: mouseY is negated (-) so moving mouse UP tilts top TOWARD you
        - translateZ(6px) lifts the card slightly in 3D space
      */
      card.style.transform = `
        perspective(600px)
        rotateY(${mouseX * tiltAmount}deg)
        rotateX(${-mouseY * tiltAmount}deg)
        translateY(-6px)
        translateZ(6px)
      `;

    });

    // Mouse leaves the card — reset to flat
    card.addEventListener('mouseleave', () => {
      /*
        Transition back smoothly. The CSS already has transition on .card
        (transform 0.3s ease) so this will animate back nicely.
      */
      card.style.transform = '';  // Empty string removes the inline style, falling back to CSS
    });

  });


  /* ============================================================
     SECTION 5: TYPING CURSOR EFFECT (Optional Enhancement)
     
     GOAL: Add a blinking cursor after the subtitle text, like a
     terminal showing "Computer Science Student & Aspiring Software
     Developer|" where | blinks.
     
     HOW IT WORKS:
     - Find the subtitle element.
     - Add a <span> element with class "cursor" after the text.
     - CSS animates it blinking via opacity.
     ============================================================ */

  const subtitle = document.querySelector('.hero-subtitle');

  if (subtitle) {
    // Create the cursor element
    const cursor = document.createElement('span');
    cursor.className = 'cursor';  // CSS will animate this
    cursor.textContent = '|';

    // Add the cursor span after the subtitle text
    subtitle.appendChild(cursor);

    // Add CSS for blinking directly via a <style> tag
    // (Alternatively, put this in style.css)
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
      .cursor {
        color: var(--accent);           /* Red cursor */
        font-weight: 300;
        margin-left: 2px;
        animation: blink 1s step-end infinite;  /* Blinks sharply */
      }

      /* blink: toggles between visible and invisible */
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
    `;
    // Add the <style> to the document <head>
    document.head.appendChild(cursorStyle);
  }


  /* ============================================================
     SECTION 5B: SKILL BAR ANIMATION (skills.html)

     GOAL: The red progress bars animate from 0% to their
     target width when they scroll into view.

     HOW IT WORKS:
     - Each .skill-fill has style="--target-width: 65%" in the HTML
     - It starts at width: 0% in CSS
     - When this observer fires, it adds class "animated"
     - CSS then transitions: width: var(--target-width)
     - The bar fills up smoothly over 1.2 seconds

     NOTE: querySelectorAll returns an empty list on pages that
     have no .skill-fill elements — forEach just does nothing.
     No errors, no crashes. Safe to run on every page.
  ============================================================ */

  const skillBars = document.querySelectorAll('.skill-fill');

  if (skillBars.length > 0) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');  // triggers CSS width transition
            barObserver.unobserve(entry.target);     // only animate once
          }
        });
      },
      { threshold: 0.3 }  // fire when 30% of bar is visible
    );

    skillBars.forEach(bar => barObserver.observe(bar));
  }


  /* ============================================================
     SECTION 5C: CONTACT FORM HANDLER (contact.html)

     GOAL: When "Send message" is clicked:
     1. Stop the page refreshing (event.preventDefault)
     2. Read the name, email, message values
     3. Validate nothing is empty
     4. If valid → hide form, show success message
     5. If invalid → alert the user

     NOTE: This is a frontend-only demo — no email is actually
     sent. To send real emails, use Formspree:
     Change the <form> action to your Formspree endpoint and
     remove this JS block.
  ============================================================ */

 


  /* ============================================================
     SECTION 6: CONSOLE EASTER EGG
     
     GOAL: Developers who open the browser console (F12) will see
     a fun message — a nice personal touch for a CS portfolio!
     
     console.log() prints to the browser's developer console.
     %c applies CSS styling to the logged text.
     ============================================================ */
  console.log(
    '%c👋 Hey, you found the console!',
    'color: #e63030; font-size: 18px; font-weight: bold;'
  );
  console.log(
    '%cThanks for checking out Harshil\'s portfolio. Built with HTML, CSS & vanilla JS.',
    'color: #888; font-size: 12px;'
  );

}); // End of DOMContentLoaded