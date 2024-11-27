import api from './api';

export const retardService = {
  checkRetard: async (sessionId) => {
    try {
      const response = await api.get(`/retards/check/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateJustification: async (idRetard) => {
    try {
      const response = await api.put(`/retards/justify/${idRetard}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

//   updateJustification: async (idRetard, formData) => {
//     const response = await fetch(`${API_URL}/retards/${idRetard}/justification`, {
//       method: 'POST',
//       body: formData,
//       // Don't set Content-Type header - let the browser set it with boundary
//     });
//     if (!response.ok) throw new Error('Failed to update justification');
//     return response.json();
// },


  updateDescription: async (idRetard, description) => {
    try {
      const response = await api.put(`/retards/description/${idRetard}`, 
        { description }, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }};


