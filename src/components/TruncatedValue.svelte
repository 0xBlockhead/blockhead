<script module lang="ts">
	// Types/constants
	export enum TruncatedValueFormat {
		Abbr = 'Abbr',
		Visual = 'Visual',
		VisualCharacters = 'VisualCharacters',
	}
</script>


<script lang="ts">
	// Props
	let {
		value,
		startLength = 6,
		endLength = 4,
		format = TruncatedValueFormat.Visual,
	}: {
		value: string | null | undefined
		startLength?: number
		endLength?: number
		format?: TruncatedValueFormat
	} = $props()


	// Derived
	const rendered = $derived(
		value ?? '',
	)
</script>


{#if rendered.length <= startLength + endLength}
	{rendered}
{:else if format === TruncatedValueFormat.Abbr}
	<abbr
		data-text="font-monospace"
		title={rendered}
	>
		{`${rendered.slice(0, startLength)}⸱⸱⸱${rendered.slice(-endLength)}`}
	</abbr>
{:else if format === TruncatedValueFormat.Visual}
	{@const start = rendered.slice(0, startLength)}

	{@const middle = rendered.slice(startLength, -endLength || undefined)}

	{@const end = rendered.slice(-endLength || undefined)}

	<span
		class="truncated-value format-visual"
		data-text="font-monospace"
		role="button"
		tabindex="0"
		aria-label={rendered}
	>
		<span>{start}</span><span
			class="middle"
		><span>{middle.slice(0, middle.length / 2)}</span><span
				aria-hidden="true"
			></span><span>{middle.slice(middle.length / 2)}</span></span><span>{end}</span>
	</span>
{:else if format === TruncatedValueFormat.VisualCharacters}
	<span
		class="truncated-value format-visual-characters"
		data-text="font-monospace"
		role="button"
		tabindex="0"
		aria-label={rendered}
	>
		{#if startLength}
			<span>{rendered.slice(0, startLength)}</span>
		{/if}
		<span class="middle">
			{#each rendered.slice(startLength, -endLength || undefined) as char}
				<span>{char}</span>
			{/each}
		</span>
		{#if endLength}
			<span>{rendered.slice(-endLength)}</span>
		{/if}
	</span>
{/if}


<style>
	.truncated-value {
		&:is(:active, :focus-within) {
			--isTruncated: 0;
		}

		&:not(
			:active,
			:focus-within
		) {
			--isTruncated: 1;
			cursor: zoom-in;
		}

		:global(
			:is(
				[data-pressable],
				[role='button'],
				[draggable],
				:where(
					summary,
					a,
					select,
					option,
					button,
					input,
					label:has(> input:is([type='checkbox'], [type='radio']), button),
					::scroll-marker
				)
			)
		) & {
			--isTruncated: 1;
			cursor: inherit;
		}

		* {
			text-decoration: none;
		}

		&:focus-within {
			outline: 1px solid var(--accent);
			outline-offset: 2px;
			text-shadow: 0 0.5px 0.2em var(--accent);
		}

		&.format-visual > .middle {
			align-items: baseline;

			> span {
				word-break: break-all;

				transition-property: font-size;
				transition-duration: 0.2s;
				transition-timing-function: var(--transition-easeOutExpo);

				&:not(:empty) {
					font-size: calc((1 - var(--isTruncated)) * 1em);
					letter-spacing: calc((1 - var(--isTruncated)) * 0.03ch);
				}

				&:empty {
					font-size: calc(var(--isTruncated) * 1em);
					letter-spacing: calc(var(--isTruncated) * 0.03ch);

					opacity: var(--isTruncated);
					text-decoration: none;

					pointer-events: none;

					&:after {
						content: '⸱⸱⸱';
					}
				}
			}
		}

		&.format-visual-characters > span {
			vertical-align: baseline;

			&.middle {
				> span {
					--d: (
						1
						- sin(
							calc(
								(sibling-index() - 1)
								* 180deg
								/ max(1, sibling-count() - 1)
							)
						)
					);

					--x: (pow(var(--d), var(--isTruncated) * 2.5));

					vertical-align: middle;

					font-size: calc(var(--x) * 1em);
					letter-spacing: calc(var(--x) * 0.03ch);

					transition-property: font-size;
					transition-duration: 0.2s;
				}
			}
		}
	}
</style>
