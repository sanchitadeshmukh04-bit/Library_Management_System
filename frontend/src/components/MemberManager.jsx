import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/members";

function MemberManager() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    membershipId: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(API_URL);
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
  const search = searchTerm.toLowerCase();

  return (
    member.name.toLowerCase().includes(search) ||
    member.email.toLowerCase().includes(search) ||
    member.phone.toLowerCase().includes(search) ||
    member.membershipId.toLowerCase().includes(search)
  );
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      membershipId: "",
    });

    setEditingId(null);
  };

  
const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};


const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate Indian mobile number
  if (!validatePhone(form.phone)) {
    alert(
      "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
    );
    return;
  }

  try {
    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, form);
      alert("Member updated successfully!");
    } else {
      await axios.post(API_URL, form);
      alert("Member added successfully!");
    }

    resetForm();
    fetchMembers();
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Something went wrong"
    );
  }
};

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipId: member.membershipId,
    });

    setEditingId(member._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Member deleted successfully!");
      fetchMembers();
    } catch (error) {
      alert("Failed to delete member");
    }
  };

  return (
    <div>
      <h1 className="page-title">👥 Members</h1>

      <p className="page-subtitle">
        Manage library members
      </p>

      {/* Add / Update Member */}
      <div className="section-card">

        <h2>
          {editingId ? "Update Member" : "Add New Member"}
        </h2>

        <form onSubmit={handleSubmit} className="form-grid">

          <input
            name="name"
            placeholder="Member Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          
<input
  name="phone"
  type="tel"
  placeholder="10-digit mobile number"
  value={form.phone}
  onChange={(e) => {
    const value = e.target.value;

    // Allow only digits and a maximum of 10
    if (/^\d{0,10}$/.test(value)) {
      handleChange(e);
    }
  }}
  pattern="[6-9][0-9]{9}"
  maxLength={10}
  title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
  required
/>

          <input
            name="membershipId"
            placeholder="Membership ID"
            value={form.membershipId}
            onChange={handleChange}
            required
          />

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
            >
              {editingId
                ? "Update Member"
                : "Add Member"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Members Table */}
      <div className="section-card">

        <div className="section-header">
          <h2>Member List</h2>

          <span className="count-badge">
            {members.length} Members
          </span>
        </div>

        <div className="search-container">
  <input
    type="text"
    placeholder="🔍 Search by name, email, phone or membership ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
</div>

        {filteredMembers.length === 0 ? (
  <p>No members match your search.</p>
        ) : (
          <div className="table-container">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Membership ID</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredMembers.map((member) => (
                  <tr key={member._id}>

                    <td>{member.name}</td>

                    <td>{member.email}</td>

                    <td>{member.phone}</td>

                    <td>
                      <span className="count-badge">
                        {member.membershipId}
                      </span>
                    </td>

                    <td>

                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(member)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(member._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default MemberManager;