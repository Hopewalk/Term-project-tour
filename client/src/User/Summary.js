import ax from "../conf/ax";
import React, { useState, useEffect } from "react";

export default function detail() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ax.get("/trips");
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await ax.post(`/payment`, {
        username: e.target.username.value,
        firstname: e.target.firstname.value,
        lastname: e.target.lastname.value,
        number: e.target.number.value,
        email: e.target.email.value,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="detail-container">
        {data.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <p>{item.description}</p>
            <p>{item.productcode}</p>
            <p>{item.date}</p>
            <p>{item.hotel}</p>
            <p>{item.tavel}</p>
          </div>
        ))}
      </div>
      <div className="form-container">
        <div className="form">
          <form onSubmit={handlePayment}>
            <div className="form-group">
              <label htmlFor="name">ชื่อ</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your firstname"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">นามสกุล</label>
              <input
                type="text"
                id="lastname"
                placeholder="Enter your lastname"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">อีเมล</label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="number">เบอร์โทรศัพท์</label>
              <input type="number" id="number" required />
            </div>
            <div className="form-group">
              <label htmlFor="note">หมายเหตุ</label>
              <input type="text" id="note" />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
