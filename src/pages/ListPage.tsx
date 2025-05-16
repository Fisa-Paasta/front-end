import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Application } from '@/types/application';

export default function ListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (!response.ok) throw new Error('신청서 목록을 불러오는데 실패했습니다.');
      const data: Application[] = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleCreateClick = () => {
    navigate('/survey');
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('신청서 삭제에 실패했습니다.');

      alert('신청서가 성공적으로 삭제되었습니다.');
      fetchApplications();
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <div className="formbold-form-title">
          <h2>인프라 신청 목록</h2>
          <button className="formbold-btn" onClick={handleCreateClick}>
            신청서 작성
          </button>
        </div>

        <table className="formbold-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>환경</th>
              <th>OS</th>
              <th>자원</th>
              <th>신청일</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id}>
                <td>{index + 1}</td>
                <td>{app.env}</td>
                <td>
                  {app.os.name} {app.os.version}
                </td>
                <td>
                  CPU: {app.resources.cpu}
                  <br />
                  RAM: {app.resources.ram}
                  <br />
                  Disk: {app.resources.disk}
                </td>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
                <td>{app.status || '대기중'}</td>
                <td>
                  <button
                    className="formbold-btn-sm"
                    onClick={() => navigate(`/survey/${app.id}`)}
                  >
                    상세보기
                  </button>
                  <button
                    className="formbold-btn-sm formbold-btn-delete"
                    onClick={() => handleDelete(app.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
