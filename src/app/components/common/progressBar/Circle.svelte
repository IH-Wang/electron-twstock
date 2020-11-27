<style>
</style>

<script>
	// css
	import styled from './Circle.module.scss';

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

<svg class="{styled.circleSvg}" width="{size}" height="{size}">
	<circle
		class="{styled.circleBg}"
		stroke="{circleOneStroke}"
		cx="{center}"
		cy="{center}"
		r="{radius}"
		stroke-width="{strokeWidth}"
	></circle>
	<circle
		class="{styled.circleBar}"
		stroke="{circleTwoStroke}"
		cx="{center}"
		cy="{center}"
		r="{radius}"
		stroke-width="{strokeWidth}"
		stroke-dasharray="{circumference}"
		stroke-dashoffset="{offset}"
	></circle>
	<text class="{styled.circleText}" x="{center}" y="{center + 20}">{$progress.toFixed(0)}%</text>
</svg>
