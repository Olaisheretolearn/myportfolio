// posts.js
window.POSTS = [
  {
    slug: "manitoba-gis-oil-well",
    title: "A Province-Scale Geospatial Analytics Pipeline for Oil Well Exploration in Manitoba",
    author: "Olaoluwa Oke",
    date: "Nov 2025",
    Live: "Playground",
    liveURL: "https://wells-analysis.netlify.app/",
    linkText: "GitHub",
    linkUrl: "https://github.com/Olaisheretolearn/man-wells",
    contentHtml: `
      <p><strong>TL;DR:</strong>This project turns raw Manitoba government GIS 
      data into a full geospatial analytics system: shapefiles are normalized in QGIS, 
      stored in MongoDB with spherical indexes, and exposed through a Node.js API that supports 
      radius searches, viewport queries, and exact user-drawn polygon selection. On top of that, 
      the system computes research-grade spatial metrics like area, density, nearest-neighbor clustering 
      (NNI), and company concentration (HHI)—and serves them to an interactive Leaflet map on demand. 
      In short, it goes beyond mapping to enable real spatial reasoning about drilling patterns, 
      competition, and land use using open data and open tools.</p>

      <img src="/images/Oilwell.png" alt="placeholder" />

      <h2>Abstract</h2>
      <p>Public-sector geospatial datasets are typically published for cartographic use rather than 
      computational analysis. This work presents the design and implementation of an end-to-end geospatial
       analytics system for Manitoba oil wells, transforming raw provincial GIS data into a queryable, 
       analytics-driven platform. The system integrates spatial normalization, geodesic indexing, 
       polygon-based querying, and statistical spatial analysis within a unified web architecture. 
       Beyond visualization, the platform enables density estimation, nearest-neighbor analysis, and 
       market concentration metrics over arbitrarily defined regions. This project demonstrates how 
       modern web and database technologies 
      can be composed to support research-grade spatial reasoning on real-world industrial data.</p>

      <blockquote>
        A map is not just a picture — it’s a query interface.
      </blockquote>

      <h2>Introduction</h2>
      <p>Geospatial information systems (GIS) are widely used for mapping and 
      regulatory reporting in the oil and gas sector. However, many publicly 
      available datasets remain difficult to analyze programmatically due to projection 
      inconsistencies, 
      heterogeneous schemas, and tooling assumptions centered on desktop GIS workflows. 
      As a result, spatial reasoning—such as identifying clustering patterns, competitive 
      concentration, or regional development trends—often requires ad hoc preprocessing 
      and manual inspection.This project addresses
       that gap by constructing a province-scale geospatial 
       system that treats spatial data as a first-class analytical object. 
       The guiding objective is not merely to display wells on a map, but to 
       enable structured spatial queries and quantitative analysis over user-defined regions.</p>

       <h2>Data Source and Preprocessing</h2>
      <p>The primary data source consists of publicly released oil and gas well datasets
       from the Province of Manitoba. These datasets are distributed as shapefiles with associated 
       projection metadata and tabular attributes. 
      While authoritative, the raw data is not directly suitable for web-based spatial querying. <br> <br>

      Preprocessing was performed using QGIS and consisted of:

      <ul>
      <li>Coordinate reference system normalization to EPSG:4326 (longitude/latitude)</li>
      <li>Attribute filtering and schema standardization</li>
      <li>Geometry validation to ensure a single, well-defined point per well,</li>
      <li>Export to GeoJSON as an intermediate, web-compatible representation.</li>
      </ul>
      
      This preprocessing step is critical: errors in CRS handling or geometry validity propagate into distance calculations and polygon queries downstream.
      
      </p>

<h2>Data Model and Geospatial Indexing</h2>
      <p>The cleaned dataset was ingested into MongoDB, selected for its native support of 
      spherical geospatial indexes and query operators.
       Each well is represented as a document containing descriptive attributes and a
        GeoJSON Point geometry. 

A 2dsphere index on the location field enables efficient 
execution of proximity searches and region-based queries. 
Without this index, spatial operations degrade to full collection scans,
 making interactive exploration infeasible at scale.</p>


 <h2>Backend Architecture</h2>
      <p>The backend is implemented using Node.js and Express, with explicit input 
      validation enforced via schema definitions. 
      All spatial endpoints validate coordinate bounds, distance limits, and polygon structure before execution.

This defensive design is essential in a geospatial context, where malformed 
polygons or unbounded radius queries can produce excessive computational load 
or undefined results.</p>


 <h2>Spatial Query Primitives</h2>
      <p><strong>5.1 Proximity Queries</strong> <br>
      Radial searches are implemented using spherical $near queries, returning 
      wells within a specified geodesic distance of a reference point. 
      Distances are computed along the Earth’s surface rather than using 
      planar approximations.

      <br><br>

      <strong>5.2 Viewport-Constrained Queries</strong> <br>
      Bounding-box queries are used to limit results to the current map viewport. 
      This pattern ensures that the frontend only requests spatial features 
      relevant to the user’s current context, reducing payload size and 
      improving responsiveness.
      </p>

      <br>
      <strong>5.3 Polygon-Based Queries</strong> <br>
      Users may define arbitrary polygonal regions via direct interaction with the map. 
      These polygons are transmitted to the backend, normalized, and closed if necessary 
      before being evaluated using $geoWithin queries.
       This enables true spatial selection rather than approximate or visual filtering.
      </p>


      <h2>Polygon-Level Spatial Analytics</h2>
      <p>Once a polygonal subset of wells is identified, the system computes several higher-order metrics.</p>
      <p><strong>6.1 Area and Density</strong> <br>
      Polygon area is computed geodesically, accounting for Earth curvature. 
      Well density is defined as the number 
      of wells per unit area, enabling comparisons across regions of different sizes.

      <br><br>

      <strong>6.2 Nearest-Neighbor Analysis</strong> <br>
Mean nearest-neighbor distance is calculated using haversine distances between wells. 
To manage computational complexity, the analysis is capped via random subsampling 
when point counts exceed predefined thresholds. <br>

The Clark–Evans Nearest Neighbor Index (NNI) is then derived, 
allowing classification of spatial patterns as clustered, random, 
or uniformly spaced.
      </p>

      <br>
      <strong>6.3 Market Concentration</strong> <br>
      Company dominance within a polygon is quantified using the Herfindahl–Hirschman Index (HHI),
       computed from each operator’s share of wells in the region. 
      This introduces an economic dimension to spatial selection.
      </p>


  <h2>Aggregated Spatial Statistics</h2>
      <p>MongoDB’s $facet aggregation stage is used to compute multiple summaries in a single pass, including

      <ul>
      <li>Top operators by well count,</li>
      <li>Mineral rights distributions (e.g., Crown vs. Freehold),</li>
      <li>Deviation versus outcome relationships,</li>
      <li>Temporal summaries of well status dates.</li>
      </ul>
      
      This approach minimizes query overhead while preserving analytical flexibility.
      </p>

       <h2>8. Frontend Integration</h2>
      <p>The frontend employs Leaflet with OpenStreetMap tiles for interactive visualization.
       GeoJSON features are streamed from the backend based on viewport or polygon constraints. 
       A core design principle is
       that the map never loads the entire dataset; all rendering is demand-driven by spatial queries.</p>

          <h2>9. Discussion</h2>
      <p>Most web-based GIS applications emphasize visualization over analysis. By contrast, this
       system integrates spatial indexing, statistical modeling, and domain-specific metrics into a 
       unified architecture. The result is a platform capable of supporting exploratory research, 
      competitive analysis, and policy-relevant spatial reasoning on real-world industrial data.</p>

            <h2>10. Conclusion</h2>
      <p>This work demonstrates that modern web technologies can support research-grade
       geospatial analysis without reliance on proprietary GIS servers. By treating geometry as 
       computation rather than decoration, the system enables users to move from “where are the 
       wells?” to “what patterns do they form, and why?”

The distinction between mapping and spatial reasoning is subtle but 
fundamental—and it is precisely in that distinction 
that this project is situated.</p>

<br> <br>

      <p>Contributions? Questions? <br> Please reach out at reacholaoke@gmail.com</p>
    `
  },


{
  slug: "awa-app",
  title: "Awa – Roommates Communication App",
  author: "Ola Oke",
  date: "2025",
  linkText: "GitHub",
  linkUrl: "https://github.com/Olaisheretolearn/Awa", 
  contentHtml: `
    <p><strong>TL;DR:</strong> Awa is a co-living coordination app that starts with the boring essentials
    (chores, bills, shopping, chat) and gradually evolves toward relationship-aware coordination
    (personality + cultural expectations), so small misunderstandings don’t turn into household wars.</p>

    <h2>Why Awa</h2>
    <p>
      Most roommate problems aren’t caused by “big issues.” They’re caused by tiny repeated frictions:
      a bill that stays unpaid, a chore that keeps getting skipped, a message that gets buried, a guest policy
      that was never made explicit. Group chats optimize for conversation. Awa optimizes for <em>coordination</em>.
    </p>

    <h2>Research Roots (But Built Like an Engineering Product)</h2>
    <p>
      The long-term vision is informed by research on roommate dynamics: conflict resolution, communication styles,
      and how personality/cultural expectations shape shared living. The practical takeaway for product design is simple:
      <strong>misaligned communication styles + avoidance → prolonged conflict</strong>, so the interface should make
      “hard conversations” easier to start, safer to structure, and harder to ignore.
    </p>
    <p>
      That said, we treated this like an engineering problem first: deliver a solid MVP that a household can rely on daily,
      then layer intelligence on top. No “magic” before the plumbing works.
    </p>

    <h2>MVP Scope</h2>
    <p>These are the systems we shipped (or are shipping) first, because every shared household needs them:</p>

    <h3>Bills & Payments</h3>
    <p>
      Roommates can log bills (one-time or recurring like rent/utilities). The payer records the amount and what it covers.
      Awa splits the cost evenly across all housemates (including the payer) and generates per-person invoices.
      Payments happen outside the app (e.g., Interac), but Awa manages confirmation: once the payer marks reimbursements
      as received, the bill is closed and archived.
    </p>

    <h3>Shopping Lists</h3>
    <p>
      Multiple concurrent lists (groceries, supplies, decorations). Anyone can add/remove items.
      Checked items can be staged into a “payment list,” which generates a bill automatically—so if someone buys groceries,
      the split happens immediately. A future update will add receipt parsing.
    </p>

    <h3>Tasks & Chores</h3>
    <p>
      Assign tasks with due dates and ownership. The assignee gets notified and can mark tasks complete.
      This keeps accountability explicit and reduces “I thought you were doing it.”
    </p>

    <h3>Chat & Messaging</h3>
    <p>
      A lightweight group chat with timestamps and toggle-style reactions (tap again to remove/change).
      Planned: an anonymous “raise an issue” flow for sensitive topics, so roommates can surface friction without fear of escalation.
    </p>

    <h3>Misc Quality-of-Life</h3>
    <ul>
      <li>Multi-currency support</li>
      <li>Room invite codes (deactivate / regenerate)</li>
      <li>Store each housemate’s Interac email for quick transfers</li>
      <li>Dashboard summary: chores, shopping, bills at a glance</li>
    </ul>

    <h2>Long-Term Vision: Relationship-Aware Coordination</h2>
    <p>
      The goal isn’t to turn Awa into therapy. It’s to introduce small, practical nudges that reduce misinterpretation.
      Over time, we want to support optional personality and cultural expectation settings, then translate those into
      plain-language guidance.
    </p>

    <p><strong>Example:</strong></p>
    <ul>
      <li>
        <strong>Fatima (INTJ)</strong>: If she withdraws after a long day, it doesn’t mean she dislikes her roommates.
        It’s how she recharges. Respecting her quiet time makes shared moments better later.
      </li>
      <li>
        <strong>Alex (ENFP)</strong>: He thrives on spontaneous hangouts and may invite friends over.
        A quick heads-up about noise or guest policies keeps the vibe fun without crossing boundaries.
      </li>
    </ul>

    <blockquote>
      Coordination problems are often human problems. Awa aims to solve both starting with the system, then supporting the people.
    </blockquote>

    <h2>Tech Stack</h2>
    <ul>
      <li><strong>Backend:</strong> Spring Boot (REST APIs, clean service layering, scalable baseline)</li>
      <li><strong>Database:</strong> MongoDB (flexible schemas for evolving household models)</li>
      <li><strong>Frontend:</strong> Flutter (single codebase for iOS/Android, fast iteration)</li>
      <li><strong>Auth:</strong> JWT + BCrypt (secure sessions + password hashing)</li>
      <li><strong>Deployment:</strong> Dockerized, hosted on Render (MVP), with a planned migration later</li>
    </ul>

    <h2>Architecture Notes (How the Data is Shaped)</h2>
    <p>
      Awa’s core unit is a <strong>Room</strong>. Everything hangs off it: members, bills, tasks, lists, messages.
      MongoDB fits well here because household features evolve quickly and vary by usage patterns.
    </p>
    <ul>
      <li><strong>Room</strong> → invite code, settings, currency, createdAt</li>
      <li><strong>Member</strong> → role, Interac email, optional profile signals</li>
      <li><strong>Bill</strong> → payerId, total, split policy, invoices[], status</li>
      <li><strong>Task</strong> → assigneeId, dueDate, status, audit trail</li>
      <li><strong>ShoppingList</strong> → items[], checkedBy, “staged for payment” snapshot</li>
      <li><strong>Message</strong> → roomId, senderId, reactions (toggle map)</li>
    </ul>

    <h2>UX & Visual Direction</h2>
    <p>
      Àwa plays on both “Our” and the Yoruba idea of “us.” We wanted it to feel warm and human:
      logistics don’t have to be sterile. The UI leans expressive—color, illustrations, and friendly microcopy—
      so users feel welcomed instead of managed.
    </p>

    <h3>Typography</h3>
    <p>
      We picked <strong>Darker Grotesque</strong> for clarity and structure and <strong>Boulder</strong> for a soft,
      approachable tone—authority without coldness.
    </p>

    <h3>Color & Mood</h3>
    <p>
      Bright blues, bold yellows, deep purples—energy + trust. The palette reinforces that co-living is daily life,
      not admin work.
    </p>

    <h3>Illustration & Motion</h3>
    <p>
      Stickers and tiny cues (“2 chores pending”, “5 messages”) add lightness. The goal is small doses of joy,
      not noise.
    </p>

    <h2>What’s Next</h2>
    <ul>
      <li>Receipt parsing → auto-create bills from scanned receipts</li>
      <li>Anonymous issue flow → structured conflict prompts</li>
      <li>Fairness insights → “who’s doing what” without shaming</li>
      <li>Optional personality/cultural hints → plain-language expectations</li>
    </ul>

    <p>
      For now, the focus is reliability: fast, clean coordination that households can trust every day.
    </p>
    
    <img src="/images/awasc5.jpg" alt="placeholder"  style="width:20%;height:auto;"/>
     <img src="/images/awasc6.jpg" alt="placeholder"  style="width:20%;height:auto;"/>
      <img src="/images/awasc7.jpg" alt="placeholder"  style="width:20%;height:auto;"/>
       <img src="/images/awasc8.jpg" alt="placeholder"  style="width:20%;height:auto;"/>
        <img src="/images/awasc9.jpg" alt="placeholder"  style="width:20%;height:auto;"/>
   
   
   

    <p>Contributions? Questions? <br> Please reach out at reacholaoke@gmail.com
  `
},


{
  slug: "office-hours",
  title: "Office Hours – Live Queue + Video Call System",
  author: "Ola Oke",
  date: "2025",
  linkText: "GitHub",
  linkUrl: "https://github.com/yourusername/office-hours", // change later
  contentHtml: `
    <p><strong>TL;DR:</strong> Office Hours is a live queue + video call platform that makes instructor help feel fair,
    fast, and organized. Students join a queue with context. Instructors handle the queue like a triage board, then start
    a call instantly when it’s your turn.</p>

    <h2>The Problem</h2>
    <p>
      Traditional office hours break down in predictable ways: students show up at once, the loudest question dominates,
      shy students wait forever, and instructors spend more time coordinating than teaching.
      The “help” part is fine. The <em>system</em> around it is the bottleneck.
    </p>

    <h2>The Product Idea</h2>
    <p>
      Treat office hours like a real-time service queue. Students should be able to:
    </p>
    <ul>
      <li>Join a queue from anywhere</li>
      <li>State their question + urgency level</li>
      <li>See their position and estimated wait</li>
      <li>Get pulled into a call instantly when it’s their turn</li>
    </ul>

    <p>
      Instructors should be able to:
    </p>
    <ul>
      <li>See the queue live with question summaries</li>
      <li>Reorder / prioritize (triage) when needed</li>
      <li>Mark sessions done, no-shows, or “needs follow-up”</li>
      <li>Start a 1:1 call without exchanging links</li>
    </ul>

    <h2>MVP Features</h2>
    <h3>Live Queue</h3>
    <p>
      A student joins the queue with a short description (and optionally a course/topic tag).
      The queue updates live for everyone, so students don’t have to guess when to show up.
    </p>

    <h3>Instructor Dashboard</h3>
    <p>
      The instructor view behaves like a lightweight operations console:
      who’s waiting, what they need, how long they’ve been waiting, and quick actions to manage flow.
    </p>

    <h3>Video Call Hand-off</h3>
    <p>
      When the instructor starts a session, the system generates a “room” and both sides enter the call
      from inside the app. No copying meeting links, no chaos.
    </p>

    <blockquote>
      The goal is not “a Zoom clone.” The goal is <strong>queue discipline + instant handoff</strong>.
    </blockquote>

    <h2>System Design (How It Works)</h2>
    <p>
      The core concept is a <strong>Queue Session</strong> tied to a course/instructor time window.
      Students create <strong>Queue Entries</strong>. When it’s time, the instructor promotes an entry into a
      <strong>Call Room</strong>.
    </p>

    <ul>
      <li><strong>QueueSession</strong>: instructorId, courseId, status, createdAt</li>
      <li><strong>QueueEntry</strong>: sessionId, studentId, question, priority, status, timestamps</li>
      <li><strong>Room</strong>: sessionId, entryId, roomId, participants, state</li>
    </ul>

    <h2>Realtime Layer</h2>
    <p>
      The queue needs to feel “live,” so updates are pushed immediately:
      join/leave, reorder, status changes, call started, call ended.
      This is where WebSockets (or SSE) shine: one source of truth, many subscribed clients.
    </p>

    <h3>Events (Examples)</h3>
    <ul>
      <li><code>queue:joined</code> → new entry added</li>
      <li><code>queue:updated</code> → reorder / status changes</li>
      <li><code>call:created</code> → room created for an entry</li>
      <li><code>call:ended</code> → wrap up, close room, mark entry done</li>
    </ul>

    <h2>Fairness & UX Decisions</h2>
    <p>
      This project is “simple” on the surface, but fairness is the hard part. A few decisions mattered:
    </p>
    <ul>
      <li><strong>Visibility:</strong> Students can see progress so they don’t hover anxiously.</li>
      <li><strong>Context upfront:</strong> The question summary reduces back-and-forth.</li>
      <li><strong>Soft prioritization:</strong> Instructors can triage without turning it into a mess.</li>
      <li><strong>No link juggling:</strong> Call handoff is one click.</li>
    </ul>

    <h2>Security & Abuse Prevention</h2>
    <ul>
      <li>Authenticated access for students/instructors</li>
      <li>Room tokens so only the correct participants can join calls</li>
      <li>Rate limits on joins / spammy actions</li>
      <li>Session-level moderation tools (kick/no-show)</li>
    </ul>

    <h2>What’s Next</h2>
    <ul>
      <li><strong>Estimated wait time</strong> based on rolling average session duration</li>
      <li><strong>Group sessions</strong> for duplicate questions (“join this ongoing call”) </li>
      <li><strong>Attachments</strong> (paste code snippet / upload screenshot)</li>
      <li><strong>Post-session notes</strong> so students leave with a summary</li>
      <li><strong>Analytics</strong> (peak hours, common topics, bottlenecks)</li>
    </ul>

    <p>
      The big win: once a queue is a real system, office hours become accessible even for students
      who wouldn’t normally show up in person.
    </p>
  `
},

{
slug: "jiwo-app",
title: "Jiwo — Live Collaborative Lecture Notes",
author: "Ola Oke",
date: "2025",
linkText: "GitHub",
linkUrl: "[https://github.com/Olaisheretolearn/Jiwo](https://github.com/Olaisheretolearn/Jiwo)",
contentHtml: ` <p><strong>TL;DR:</strong> Jiwo is a live, session-based note-taking app for lectures, where one person types and everyone else follows in real time. It replaces a room full of clanking keyboards with a single shared stream, while still allowing individuals to keep their own local edits.</p>

 <img src="/images/jiwo.png" alt="placeholder" />
<h2>Why Jiwo</h2>
<p>
  In most lectures, dozens of students are typing the same thing at the same time. Everyone is focused on transcription,
  not understanding. Jiwo starts from a simple idea: <em>what if note-taking was shared instead of duplicated?</em>
</p>
<p>
  One person acts as the host and types the notes live. Everyone else joins the session and reads along in real time.
  Less noise, less distraction, and a single, coherent set of notes.
</p>

<h2>The Core Idea</h2>
<p>
  Jiwo is not a collaborative document where everyone edits everything at once. Instead, it separates the experience into
  two layers:
</p>
<ul>
  <li><strong>The shared stream</strong> — live notes typed by the host and synced to all participants</li>
  <li><strong>Local edits</strong> — personal additions or annotations that don’t affect the main notes</li>
</ul>
<p>
  This keeps the shared notes clean and authoritative, while still giving each student control over their own version.
</p>

<h2>Session-Based Architecture</h2>
<p>
  Jiwo is built around the concept of a live session. Each session has a unique class code that participants can use
  to join instantly. Sessions can be marked live or ended, and the system clearly distinguishes between hosts and viewers.
</p>
<p>
  This model mirrors how real classes work: a lecture starts, people join, notes are taken, and the session ends.
  The software adapts to that flow instead of forcing everything into a static document.
</p>

<h2>Real-Time Collaboration</h2>
<p>
  Under the hood, Jiwo uses WebSockets to broadcast live updates to everyone in the session. When the host types,
  updates are pushed immediately to connected viewers. Comments, claps, and live status changes are also synchronized
  in real time.
</p>
<p>
  Messages are small and typed, focusing on incremental updates rather than constantly re-sending full state.
  This keeps the system responsive even with many connected users.
</p>


<h2>Live Session Experience</h2>
<p>
  Jiwo is built around live lecture sessions. Each class has a unique session code that students use to join instantly.
  When a session is live, participants can follow the notes as they’re written in real time.
</p>
<p>
  The experience mirrors a real lecture: a session starts, people join, notes evolve live, and the session eventually ends.
</p>

 <img src="/images/jiwo2.png" alt="placeholder" />



<h2>Chat & Live Comments</h2>
<p>
  Each session includes a live comment feed where participants can ask questions, react, or clarify points
  without interrupting the lecture flow.
</p>
<p>
  Comments appear in real time for everyone in the session, creating a lightweight layer of discussion alongside the notes.
</p>



<h2>Claps & Feedback</h2>
<p>
  Jiwo includes a simple clap system that works like lightweight applause.
  Participants can send claps to show appreciation, agreement, or encouragement during a session.
</p>
<p>
  This gives the note writer immediate feedback without turning the session into a noisy chat room.
</p>


<h2>Tipping the Note Writer</h2>
<p>
  Since one person is often doing the work of typing live notes, Jiwo allows participants to tip the original writer.
  This makes it easy to acknowledge effort and support contributors directly.
</p>
<p>
  Tips are optional, but they reinforce the idea that good notes are valuable work.
</p>

<h2>After the Session</h2>
<p>
  If you miss a live session, Jiwo keeps the notes available for a limited time after the lecture ends.
  Notes remain accessible for 24 hours, so students can catch up without needing a full recording.
</p>
<p>
  This keeps sessions lightweight while still supporting short-term review.
</p>


 <img src="/images/jiwo3.png" alt="placeholder" />

<h2>Downloadable Notes</h2>
<p>
  At any point, participants can download the session notes as a text file.
  This ensures that live collaboration doesn’t come at the cost of long-term access.
</p>
<p>
  Notes are simple, portable, and easy to store or annotate later.
</p>


<h2>Lightweight Interaction</h2>
<p>
  Jiwo intentionally keeps interaction simple. Viewers can react with claps, leave comments, and follow the flow of
  the lecture without interrupting it. These features provide feedback and presence without turning the session
  into a chat room.
</p>

<h2>Persistence and Export</h2>
<p>
  Notes are stored as plain text and can be downloaded at the end of a session. This ensures that live collaboration
  does not come at the cost of long-term access. Sessions are temporary, but the knowledge isn’t.
</p>

<h2>What Jiwo Is (and Isn’t)</h2>
<p>
  Jiwo isn’t trying to replace full document editors or learning management systems. It focuses on a very specific
  moment: the live lecture. By narrowing the scope, the system stays fast, predictable, and easy to use.
</p>

<h2>Looking Forward</h2>
<p>
  Future work includes richer presence indicators, improved local annotations, and better post-session summaries.
  But the core idea will stay the same: reduce noise, share context, and let students focus on understanding rather
  than typing.
</p>
`

}






];






























function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

const slug = getSlug();
const post = (window.POSTS || []).find(p => p.slug === slug);

const titleEl = document.getElementById("postTitle");
const authorEl = document.getElementById("postAuthor");
const dateEl = document.getElementById("postDate");
const liveEl = document.getElementById("postLive");
const linkEl = document.getElementById("postLink");
const contentEl = document.getElementById("postContent");

if (!post) {
  titleEl.textContent = "Post not found";
  contentEl.innerHTML = `<p>That article doesn’t exist (yet). Go back and pick another.</p>`;
} else {
  document.title = post.title;
  titleEl.textContent = post.title;
  authorEl.textContent = post.author || "";
  dateEl.textContent = post.date || "";

  if (post.linkUrl) {
    linkEl.hidden = false;
    linkEl.textContent = post.linkText || "Link";
    linkEl.href = post.linkUrl;
  }

  
  

  if (post.liveURL) {
    liveEl.hidden = false;
    liveEl.textContent = post.Live || "Live";
    liveEl.href = post.liveURL;
  }

  contentEl.innerHTML = post.contentHtml || "";
}
