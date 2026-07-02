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
		displayType: string
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

	const mediaType = $derived(
		contentType === undefined ?
			undefined
		:
			String(contentType).split(/;\s*/)[0],
	)
	const displayTypeText = $derived(
		String(displayType),
	)
	const displayIcon = $derived(
		displayTypeText === 'image' ?
			'🖼️'
		: displayTypeText === 'video' ?
			'🎥'
		: displayTypeText === 'audio' ?
			'🔊'
		: displayTypeText === 'json' || displayTypeText === 'xml' ?
			'🗒️'
		: displayTypeText === 'binary' ?
			'📦'
		:
			'📄',
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
				{displayIcon}
				{#if fileName !== undefined}
					<TruncatedValue
						value={String(fileName)}
						format={TruncatedValueFormat.Visual}
					/>
				{:else}
					File
				{/if}
			</h3>
		</div>

		<div data-row="wrap">
			{#if contentSize !== undefined && Number.isFinite(contentSize)}
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
				<span>{displayTypeText}</span>
			{/if}

			{#if extension !== undefined}
				<span>.{String(extension)}</span>
			{/if}
		</div>
	</header>

	<div class="file-preview">
		{#if displayTypeText === 'text' || displayTypeText === 'json' || displayTypeText === 'xml'}
			<pre>{(() => {
				if (text === undefined) return undefined
				if (displayTypeText !== 'json') return text

				try {
					return JSON.stringify(
						JSON.parse(String(text)),
						null,
						2,
					)
				} catch {
					return String(text)
				}
			})()}</pre>
		{:else if displayTypeText === 'iframe' && src !== undefined}
			<iframe
				src={String(src)}
				title={fileName ?? 'Embedded content'}
			></iframe>
		{:else if displayTypeText === 'image' && src !== undefined}
			<img
				src={String(src)}
				alt={fileName ?? 'Image'}
			/>
		{:else if displayTypeText === 'video' && src !== undefined}
			<video controls>
				<source
					src={String(src)}
					type={contentType}
				/>
				<track kind="captions" />
			</video>
		{:else if displayTypeText === 'audio' && src !== undefined}
			<audio controls>
				<source
					src={String(src)}
					type={contentType}
				/>
			</audio>
		{:else if displayTypeText === 'pdf' && src !== undefined}
			<object
				data={String(src)}
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
