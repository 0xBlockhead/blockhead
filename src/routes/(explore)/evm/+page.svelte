<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	const hubKey = 'evm'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title={'EVM'}
		href={resolve('/evm')}
	>
		{#snippet children({ open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 40ch',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							EVM catalogs
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Topics"
						href={`#${hubKey}:topics`}
					>Topics</a>
					<a
						data-scroll-marker-label="Selectors"
						href={`#${hubKey}:selectors`}
					>Selectors</a>
					<a
						data-scroll-marker-label="Errors"
						href={`#${hubKey}:errors`}
					>Errors</a>
					<a
						data-scroll-marker-label="Decoder"
						href={`#${hubKey}:decoder`}
					>Decoder</a>
				{/snippet}

				{#snippet body({ open: _paneOpen })}
					<section
						id={`${hubKey}:topics`}
						data-scroll-marker-label="Topics"
					>
						<EvmTopicsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$evmTopics',
							}}
							href={resolve('/evm/topics')}
							id="topics"
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:selectors`}
						data-scroll-marker-label="Selectors"
					>
						<EvmSelectorsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$evmSelectors',
							}}
							href={resolve('/evm/selectors')}
							id="selectors"
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:errors`}
						data-scroll-marker-label="Errors"
					>
						<EvmErrorsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$evmErrors',
							}}
							href={resolve('/evm/errors')}
							id="errors"
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:decoder`}
						data-scroll-marker-label="Decoder"
						data-card
						data-column
					>
						<header data-row="wrap align-center gap-2">
							<HeadingComponent>
								Calldata decoder
							</HeadingComponent>
						</header>
						<p>
							Paste transaction input or event log hex to resolve selectors and topics via OpenChain, then decode ABI arguments.
						</p>
						<a href={resolve('/evm/calldata-decoder')}>
							Open calldata decoder
						</a>
					</section>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
