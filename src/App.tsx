import React from 'react';
import {Formik, Field, Form, useField, FieldAttributes, FieldArray} from 'formik'
import { Button, Checkbox, FormControlLabel, MenuItem, Radio, Select, TextField } from "@material-ui/core";
import * as yup from "yup";

type MyRadioProps = { label: string } & FieldAttributes<{}>;

const MyRadio: React.FC<MyRadioProps> = ({ label, ...props }) => {
  const [field] = useField<{}>(props);
  return <FormControlLabel {...field} control={<Radio />} label={label} />;
}

const MyTextField: React.FC<FieldAttributes<{}>> = ({placeholder, ...props}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <TextField placeholder={placeholder} {...field} helperText={errorText} error={!!errorText} />
  )
}

const validSchema = yup.object({
  firstName: yup.string().required().max(10),
  pets: yup.array().of(yup.object({name:yup.string().required()}))
});

const App: React.FC = () => {
  return (
    <div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          isTall: false,
          foods: [],
          drink: "",
          pets: [{ type: "cat", name: "Cat", id: `cat` + Math.random() }],
        }}
        validateOnChange={true}
        validationSchema={validSchema}
        // validate={(values) => {
        //   const errors:Record<string, string> = {};

        //   if (values.firstName.includes("bob")) {
        //     errors.firstName = "no bob";
        //   }
        //   return errors;
        // }}

        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          // make async call
          console.log(data);
          setTimeout(() => {
            setSubmitting(false);
          }, 3000);
        }}
      >
        {({ values, isSubmitting, errors }) => (
          <Form>
            <MyTextField
              placeholder="firstname"
              name="firstName"
              type="input"
            />
            <div>
              <Field
                placeholder="lastname"
                name="lastName"
                type="input"
                as={TextField}
              />
            </div>
            <div>
              <Field type="checkbox" name="isTall" as={Checkbox} />
            </div>
            <div>
              Foods: <br />
              <Field type="checkbox" value="tempe" name="foods" as={Checkbox} />
              <Field type="checkbox" value="tahu" name="foods" as={Checkbox} />
            </div>
            <div>
              Drink: <br />
              <MyRadio type="radio" value="water" name="drink" label="Water" />
              <MyRadio type="radio" value="juice" name="drink" label="Juice" />
            </div>
            <div>
              Pets: <br />
              <FieldArray name="pets">
                {(arrayHelpers)=>(
                  <div>
                    {values.pets.map((pet, idx)=>{
                      return (
                        <div key={pet.id}>
                          <div>
                            <Button
                              onClick={() => {
                                arrayHelpers.push({
                                  name: "",
                                  type: "cat",
                                  id: "cat" + Math.random(),
                                });
                              }}
                            >
                              Add Pet
                            </Button>
                          </div>
                          <MyTextField
                            placeholder="pet's name"
                            name={`pets.${idx}.name`}
                          />
                          <Field
                            type="select"
                            as={Select}
                            name={`pets.${idx}.type`}
                          >
                            <MenuItem value="cat">Cat</MenuItem>
                            <MenuItem value="horse">Horse</MenuItem>
                            <MenuItem value="rabbids">Rabbids</MenuItem>
                          </Field>
                          <Button onClick={() => arrayHelpers.remove(idx)}>
                            x
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </FieldArray>
            </div>
            <div>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Loading..." : "Submit"}
              </Button>
            </div>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
