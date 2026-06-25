<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	route: {
		kind: 'browse',
		href: '/swarm',
		component: 'SwarmBrowseView',
		children: 'route',
	},
	renderers: [
		{
			slot: 'SwarmBrowseChrome',
			component: 'SwarmBrowseEntityChrome',
			label: 'Swarm browse chrome renderer',
			for: 'summary',
		},
		{
			slot: 'SwarmBrowseForm',
			component: 'SwarmBrowseForm',
			label: 'Swarm browse form renderer',
			for: 'form',
		},
	],
	closed: [
		'protocolName',
		'registryLabel',
		'topology',
	],
	content: {
		dl: [
			[
				'protocolName',
				'homeUrl',
				'docsUrl',
				'registryLabel',
				'topology',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Resources',
				items: [
					{
						label: 'SwarmResource lookup route and examples',
					},
				],
			},
			{
				label: 'Access',
				items: [
					{
						label: '_GlobalSwarmAccess source coverage hub',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'constants protocol row',
					},
					{
						label: 'configured Bee gateway list',
					},
				],
			},
		],
	},
	summary: {
		value: 'protocolName',
		title: 'protocolName',
		after: [
			'registryLabel',
			'topology',
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SwarmProtocol>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.SwarmProtocol}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
