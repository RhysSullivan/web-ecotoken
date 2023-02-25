import { forwardRef } from "react";
import Root, { Props as RootProps } from "../Select";
import FormField, { UseFormFieldProps, useFormField } from "./form-field";

type Props = UseFormFieldProps & RootProps;

const FormSelect = forwardRef<HTMLSelectElement, Props>((props, ref) => {
	const { formFieldProps, childProps } = useFormField(props);

	return (
		<FormField {...formFieldProps}>
			<Root {...childProps} ref={ref} />
		</FormField>
	);
});

export default FormSelect;