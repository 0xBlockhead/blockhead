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
			href: '/ipfs',
			component: 'IpfsBrowseView',
			children: 'route',
		},
		renderers: [
			{
				slot: 'IpfsBrowseChrome',
				component: 'IpfsBrowseEntityChrome',
				label: 'IPFS browse chrome renderer',
				for: 'summary',
			},
		],
		closed: [
			{
				label: 'protocol name',
			},
			{
				label: 'registry label',
			},
			'topology',
		],
		content: {
			dl: [
				[
					{
						label: 'protocol name',
					},
					{
						label: 'home URL',
					},
					{
						label: 'docs URL',
					},
					{
						label: 'registry label',
					},
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
							label: 'IpfsResource lookup route and examples',
						},
					],
				},
				{
					label: 'Access',
					items: [
						{
							label: '_GlobalIpfsAccess source coverage hub',
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
							label: 'configured public gateway list',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.IpfsProtocol>
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
	entityType={EntityType.IpfsProtocol}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
