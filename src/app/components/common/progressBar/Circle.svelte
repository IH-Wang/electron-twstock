<style>
	.circleSvg {
		display: block;
		margin: 20px auto;
		max-width: 100%;
	}
	.circleBg {
		fill: none;
		stroke: var(--theme-progressBG);
	}

	.circleBar {
		fill: none;
		stroke: var(--theme-progressBar);
		transition: stroke-dashoffset 200ms ease-in-out;
	}
	.circleText {
		font-size: 3rem;
		text-anchor: middle;
		fill: var(--theme-titleBarText);
		font-weight: bold;
	}
</style>

<script>
	export let props;
	export let progress;
	let offset = 0;
	const { size, strokeWidth, circleOneStroke, circleTwoStroke } = props;
	const center = size / 2;
	const radius = size / 2 - strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;
	progress.subscribe((val) => {
		offset = ((100 - val) / 100) * circumference;
	});
</script>

<svg class="circleSvg" width="{size}" height="{size}">
	<circle class="circleBg" stroke="{circleOneStroke}" cx="{center}" cy="{center}" r="{radius}" stroke-width="{strokeWidth}"></circle>
	<circle
		class="circleBar"
		stroke="{circleTwoStroke}"
		cx="{center}"
		cy="{center}"
		r="{radius}"
		stroke-width="{strokeWidth}"
		stroke-dasharray="{circumference}"
		stroke-dashoffset="{offset}"
	></circle>
	<text class="circleText" x="{center}" y="{center + 20}">{$progress.toFixed(0)}%</text>
</svg>
