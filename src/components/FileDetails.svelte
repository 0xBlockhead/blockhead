<script lang="ts">
	// State
	let {
		contentSize,
		contentType,
		displayType,
		extension,
		fileName,
		src,
		text,
	}: {
		contentSize?: number
		contentType?: string
		displayType: ContentDisplayType
		extension?: string
		fileName?: string
		src?: string
		text?: string
	} = $props()


	// Functions
	const openSource = () => {
		if (src === undefined) return
		window.open(
			src,
			'_blank',
			'noopener,noreferrer',
		)
	}

	const downloadSource = () => {
		if (src === undefined) return
		const link = document.createElement('a')
		link.href = src
		link.download = fileName ?? ''
		link.click()
	}


	import { formatByteCount } from '$/lib/bytes.ts'

	type ContentDisplayType =
		| 'text'
		| 'image'
		| 'video'
		| 'audio'
		| 'json'
		| 'xml'
		| 'pdf'
		| 'iframe'
		| 'binary'

	const displayIconByType = {
		text: '📄',
		image: '🖼️',
		video: '🎥',
		audio: '🔊',
		json: '🗒️',
		xml: '🗒️',
		pdf: '📄',
		iframe: '🌐',
		binary: '📦',
	} as const satisfies Record<ContentDisplayType, string>


	const mediaType = $derived(
		contentType?.split(/;\s*/)[0],
	)

	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<section
	class="file-details"
	data-card
	data-column
>
	<header data-row="wrap">
		<div
			data-row="start"
			data-row-item="flexible"
		>
			<h3>
				{displayIconByType[displayType]}
				{#if fileName !== undefined}
					<TruncatedValue
						value={fileName}
						format={TruncatedValueFormat.Visual}
					/>
				{:else}
					File
				{/if}
			</h3>
		</div>

		<div data-row="wrap">
			{#if contentSize !== undefined}
				<span>{formatByteCount(contentSize)}</span>
			{/if}

			{#if mediaType !== undefined}
				<a
					href={`https://www.iana.org/assignments/media-types/${mediaType}`}
					target="_blank"
					rel="noreferrer noopener"
				>
					<TruncatedValue
						value={mediaType}
						format={TruncatedValueFormat.Visual}
					/>
				</a>
			{:else}
				<span>{displayType}</span>
			{/if}

			{#if extension !== undefined}
				<span>.{extension}</span>
			{/if}
		</div>
	</header>

	<div class="file-preview">
		{#if displayType === 'text' || displayType === 'json' || displayType === 'xml'}
			<pre>{(() => {
				if (text === undefined) return undefined
				if (displayType !== 'json') return text

				try {
					return JSON.stringify(
						JSON.parse(text),
						null,
						2,
					)
				} catch {
					return text
				}
			})()}</pre>
		{:else if displayType === 'iframe' && src !== undefined}
			<iframe
				{src}
				title={fileName ?? 'Embedded content'}
			></iframe>
		{:else if displayType === 'image' && src !== undefined}
			<img
				{src}
				alt={fileName ?? 'Image'}
			/>
		{:else if displayType === 'video' && src !== undefined}
			<video controls>
				<source
					src={src}
					type={contentType}
				/>
				<track kind="captions" />
			</video>
		{:else if displayType === 'audio' && src !== undefined}
			<audio controls>
				<source
					src={src}
					type={contentType}
				/>
			</audio>
		{:else if displayType === 'pdf' && src !== undefined}
			<object
				data={src}
				type={contentType}
				title={fileName ?? 'PDF preview'}
			>
				<p>
					PDF preview unavailable.
				</p>
			</object>
		{:else}
			<p data-text="muted">
				Binary content preview is not rendered inline.
			</p>
		{/if}
	</div>

	{#if src !== undefined}
		<footer data-row="wrap">
			<button
				type="button"
				onclick={openSource}
			>
				Open source
			</button>

			<button
				type="button"
				onclick={downloadSource}
			>
				Download
			</button>
		</footer>
	{/if}
</section>


<style>
	.file-details {
		gap: 1rem;
		padding: 1rem;
	}

	.file-preview {
		img,
		iframe,
		video,
		object {
			inline-size: 100%;
			max-inline-size: 100%;
			border: 0;
			border-radius: 0.5rem;
		}

		iframe,
		object {
			min-block-size: 32rem;
			background: white;
		}

		pre {
			overflow: auto;
			padding: 1rem;
			border-radius: 0.5rem;
			background: var(--color-bg-secondary);
		}
	}
</style>
