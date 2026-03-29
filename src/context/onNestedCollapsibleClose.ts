import { useGetSetContext } from '$/context/useContext.ts'

const {
	get: getOnNestedCollapsibleClose,
	set: setOnNestedCollapsibleClose,
} = useGetSetContext<(collapsibleId?: string) => void>(
	Symbol('onNestedCollapsibleClose')
)

export {
	getOnNestedCollapsibleClose,
	setOnNestedCollapsibleClose,
}
