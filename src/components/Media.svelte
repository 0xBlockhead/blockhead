<script lang="ts">
	// Types/constants
	import { MediaType } from '$/schema/Media.ts'


	type MediaObjectWire = {
		url: string
		width?: number
		height?: number
	}

	type MediaWire = {
		type: MediaType
		original?: MediaObjectWire
		thumbnail?: MediaObjectWire
		low?: MediaObjectWire
		medium?: MediaObjectWire
		high?: MediaObjectWire
	}

	type MediaInput = MediaWire | { url: string }


	// Props
	let {
		media,
		size = 'medium',
		alt = '',
		loading = 'lazy',
		fit = 'contain',
	}: {
		media: MediaInput | undefined
		size?: 'thumbnail' | 'low' | 'medium' | 'high' | 'original'
		alt?: string
		loading?: 'lazy' | 'eager'
		fit?: 'contain' | 'cover'
	} = $props()


	// Functions
	const isFullMedia = (m: MediaInput | undefined): m is MediaWire => (
		!!m
		&& typeof m === 'object'
		&& 'type' in m
	)
	const inferTypeFromUrl = (u: string | undefined): MediaType => {
		if (!u) return MediaType.Other
		const path = u.split('?')[0].toLowerCase()
		if (/\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(path)) return MediaType.Video
		if (/\.(mp3|wav|ogg|m4a|aac)(\?|$)/i.test(path)) return MediaType.Audio
		if (/\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i.test(path)) return MediaType.Image
		if (u.startsWith('data:image')) return MediaType.Image
		if (u.startsWith('data:video')) return MediaType.Video
		if (u.startsWith('data:audio')) return MediaType.Audio
		// CDNs / APIs often omit extensions (e.g. Farcaster imagedelivery.net)
		return MediaType.Image
	}


	// (Derived)
	const format = $derived(
		isFullMedia(media)
			? size === 'original'
				? media.original
				: size === 'high'
					? media.high
					: size === 'medium'
						? media.medium
						: size === 'low'
							? media.low
							: size === 'thumbnail'
								? media.thumbnail
								: media.original
			: undefined
	)
	const url = $derived(
		format?.url
		?? (
			media !== undefined
			&& typeof media === 'object'
			&& 'url' in media
			&& typeof media.url === 'string'
				? media.url
				: undefined
		)
	)
	const mediaType = $derived(
		isFullMedia(media)
			? media.type
			: inferTypeFromUrl(url)
	)
</script>



{#if url}
	{#if mediaType === MediaType.Image}
		<figure
			class="media-figure"
			data-fit={fit}
		>
			<img
				src={url}
				alt={alt}
				width={format?.width}
				height={format?.height}
				loading={loading}
			/>
		</figure>
	{:else if mediaType === MediaType.Video}
		<!-- svelte-ignore a11y_media_has_caption -->
		<figure
			class="media-figure"
			data-fit={fit}
		>
			<video
				src={url}
				width={format?.width}
				height={format?.height}
				controls
				preload={loading === 'eager'
					? 'auto'
					: 'metadata'}
			>
				{alt}
			</video>
		</figure>
	{:else if mediaType === MediaType.Audio}
		<figure class="media-figure">
			<audio
				src={url}
				controls
				preload={loading === 'eager'
					? 'auto'
					: 'metadata'}
			>
				{alt}
			</audio>
		</figure>
	{:else}
		<figure class="media-figure">
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				data-text="annotation"
			>
				{url}
			</a>
		</figure>
	{/if}
{/if}

<style>
	.media-figure {
		margin: 0;
		padding: 0;
		display: block;
	}

	.media-figure img,
	.media-figure video {
		display: block;
		max-width: 100%;
		height: auto;
		object-fit: contain;
	}

	.media-figure[data-fit='cover'] img,
	.media-figure[data-fit='cover'] video {
		width: 100%;
		object-fit: cover;
	}

	.media-figure video {
		background: var(--color-surface-2, #f1f5f9);
	}

	.media-figure audio {
		width: 100%;
	}
</style>
