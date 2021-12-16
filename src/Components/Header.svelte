<header>
	<nav role="navigation" class="essential-nav">
		<div id="menuToggle">
			<!--
        A fake / hidden checkbox is used as click reciever,
        so you can use the :checked selector on it.
        -->
			<input type="checkbox" />
			<!--
        Some spans to act as a hamburger.
        -->
			<span />
			<span />
			<span />
			<ul id="menu">
				<a href="https://mediainnovation.camd.northeastern.edu/2021/masters/campbell/index.html" target="_blank"
					><li>Anna Campbell</li></a
				>

				<a href="https://mediainnovation.camd.northeastern.edu/2021/masters/chuan/" target="_blank"
					><li>Sam Chuan</li></a
				>

				<a href="https://mediainnovation.camd.northeastern.edu/2021/masters/corbin/" target="_blank"
					><li>Ryan Corbin</li></a
				>

				<a href="https://mediainnovation.camd.northeastern.edu/2021/masters/kauffman/" target="_blank"
					><li>Brennan Kauffman</li></a
				>

				<a href="https://mediainnovation.camd.northeastern.edu/2021/masters/perez/" target="_blank"
					><li>Sofia Perez Arias</li></a
				>

				<a href="https://yuriko-schumacher.github.io/mass-shooting/"
					><li>Yuriko Schumacher</li></a
				>

				<a href="https://mattewolfinger.github.io/" target="_blank"
					><li>Matt Wolfinger</li></a
				>
			</ul>
		</div>
    <a href="https://mediainnovation.camd.northeastern.edu/2021/masters/" target="_blank">
      <div class="logo"></div>
    </a>
	</nav>
</header>

<style>
/* ----------------------  HAMBURGER NAV and MENU --------------------------- */

a {
		text-decoration: none;
		color: #232323;

		transition: color 0.3s ease;
	}

	a:hover {
		color: #d3222a;
	}

	/*
 * Black bar with logo
 */

	.essential-nav {
		background-color: #ededed;
		height: 55px;
		background-image: url('https://mediainnovation.camd.northeastern.edu/2021/masters/images/inno21_logo.png');
		background-repeat: no-repeat;
		background-position: center;
		background-size: auto 37px;
	}

  .essential-nav > a {
    position: relative;
  }

  .logo {
    width: 50%;
    height: 55px;
    position: fixed;
    top: 0;
    left: 25%;
  }

	#menuToggle {
		display: block;
		position: relative;
		top: 18px;
		left: 20px;
		max-width: 100px;
		z-index: 1;
		-webkit-user-select: none;
		user-select: none;
	}

	#menuToggle input {
		display: block;
		width: 40px;
		height: 32px;
		position: absolute;
		top: -7px;
		left: -5px;

		cursor: pointer;

		opacity: 0; /* hide this */
		z-index: 2; /* and place it over the hamburger */

		-webkit-touch-callout: none;
	}

	/*
 * Just a quick hamburger
 */
	#menuToggle span {
		display: block;
		width: 25px;
		height: 2px;
		margin-bottom: 5px;
		position: relative;

		background: #000;
		border-radius: 3px;

		z-index: 1;

		transform-origin: 4px 0px;

		transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
			background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;
	}

	#menuToggle span:first-child {
		transform-origin: 0% 0%;
	}

	#menuToggle span:nth-last-child(2) {
		transform-origin: 0% 20%;
	}

	/* 
 * Transform all the slices of hamburger
 * into a crossmark.
 */
	#menuToggle input:checked ~ span {
		opacity: 1;
		transform: rotate(45deg) translate(-2px, -1px);
		background: #232323;
	}

	/*
 * But let's hide the middle one.
 */
	#menuToggle input:checked ~ span:nth-last-child(3) {
		opacity: 0;
		transform: rotate(0deg) scale(0.2, 0.2);
	}

	/*
 * Ohyeah and the last one should go the other direction
 */
	#menuToggle input:checked ~ span:nth-last-child(2) {
		transform: rotate(-45deg) translate(0, -1px);
	}

	#menu {
		position: absolute;
		width: 300px;
		margin: -100px 0 0 -50px;
		padding: 50px;
		padding-top: 125px;

		background: #ededed;
		opacity: 0.9;
		list-style-type: none;
		-webkit-font-smoothing: antialiased;
		/* to stop flickering of text in safari */

		transform-origin: 0% 0%;
		transform: translate(-100%, 0);

		transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
	}

	#menu li {
		padding: 10px 0;
		margin-bottom: 10px;
		border-bottom: solid 1px white;
	}

	#menu a {
		padding: 10px 0;
		font-size: 15px;
		line-height: 16px;
		font-family: 'GrotzecCond-Demibold', 'Helvetica', sans-serif;
	}

	/* #menu span {
		font-size: 13px;
		display: inline;
		font-family: 'GrotzecCond-Demibold', 'Helvetica', sans-serif;
		padding: 1px 3px;
		color: white;
		background-color: #d3222a;
		border-radius: 0px;
	} */

	/*
 * And let's slide it in from the left
 */
	#menuToggle input:checked ~ ul {
		transform: none;
	}

	.essential-nav ul a:link li {
		font-family: 'GrotzecCond-Demibold', 'Impact', sans-serif;
		font-size: 2em;
		line-height: 28px;
		text-transform: uppercase;
	}

	.essential-nav ul a:hover li {
		color: #24608d;
	}
</style>