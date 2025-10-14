<script lang="ts">
	import '../app.css';
	import '../colors.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="57x57" href="/favicon-57x57.png" />
	<link rel="apple-touch-icon" sizes="60x60" href="/favicon-60x60.png" />
	<link rel="apple-touch-icon" sizes="72x72" href="/favicon-72x72.png" />
	<link rel="apple-touch-icon" sizes="76x76" href="/favicon-76x76.png" />
	<link rel="apple-touch-icon" sizes="114x114" href="/favicon-114x114.png" />
	<link rel="apple-touch-icon" sizes="120x120" href="/favicon-120x120.png" />
	<link rel="apple-touch-icon" sizes="144x144" href="/favicon-144x144.png" />
	<link rel="apple-touch-icon" sizes="152x152" href="/favicon-152x152.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
	<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
	<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<meta name="msapplication-TileColor" content="#ffffff" />
	<meta name="msapplication-TileImage" content="/favicon-144x144.png" />
	<meta name="msapplication-config" content="/browserconfig.xml" />
	<link rel="manifest" href="/manifest.json" />

	<title>22 – Alexander Liu</title>
	<meta property="og:title" content="22" />
	<meta property="og:type" content="article" />
	<meta property="og:image" content="/og-image.jpg" />
	<meta property="og:image:width" content="2400" />
	<meta property="og:image:height" content="1350" />
	<meta name="twitter:site" content="Alexander Liu" />
	<meta name="twitter:title" content="22" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image:src" content="/og-image.jpg" />
</svelte:head>

{@render children?.()}
