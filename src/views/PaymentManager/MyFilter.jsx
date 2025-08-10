import Select from "react-select";

export default function MyFilter({ students, filters, handleFilterChange }) {
  const options = [
    { value: "", label: "Tous" },
    ...students?.map(s => ({
      value: s.student.id,
      label: `${s.student.first_name} ${s.student.last_name}`
    }))
  ];

  const handleChange = (selectedOption) => {
    handleFilterChange({
      target: {
        name: "student_id",
        value: selectedOption ? selectedOption.value : ""
      }
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1" >Élève</label>
      <Select
        value={options.find(opt => opt.value === filters.student_id)}
        onChange={handleChange}
        options={options}
        className="w-full min-w-64"
        classNamePrefix="react-select"
        placeholder="Choisir un élève..."
        isClearable
      />
    </div>
  );
}
